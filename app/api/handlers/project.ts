import { Project, ProjectStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export class ProjectHandler {
  static async createProject(
    data: {
      title: string;
      description: string;
      authorId: string;
      category: string;
      tags: string[];
      year: number;
      status: ProjectStatus;
    },
    files: Array<{ buffer: Buffer; filename: string; mimetype: string }>
  ) {
    try {
      // Upload thumbnail (first image) and other files to Cloudinary
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const { url, public_id } = await uploadToCloudinary(file.buffer);
          return {
            name: file.filename,
            type: file.mimetype,
            size: file.buffer.length,
            url,
            public_id,
          };
        })
      );

      // Use the first image as thumbnail if it's an image
      const thumbnail = uploadedFiles.find(file => 
        file.type.startsWith('image/')
      )?.url;

      // Create project with files in MongoDB
      const project = await prisma.project.create({
        data: {
          ...data,
          thumbnail,
          files: {
            create: uploadedFiles,
          },
        },
        include: {
          author: true,
          files: true,
        },
      });

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  static async updateProject(
    projectId: string,
    data: Partial<Project>,
    newFiles?: Array<{ buffer: Buffer; filename: string; mimetype: string }>,
    removeFileIds?: string[]
  ) {
    try {
      // Handle file deletions if any
      if (removeFileIds?.length) {
        const filesToDelete = await prisma.projectFile.findMany({
          where: {
            id: {
              in: removeFileIds,
            },
          },
        });

        // Delete files from Cloudinary
        await Promise.all(
          filesToDelete.map(file => deleteFromCloudinary(file.public_id))
        );

        // Delete file records from database
        await prisma.projectFile.deleteMany({
          where: {
            id: {
              in: removeFileIds,
            },
          },
        });
      }

      // Upload new files if any
      let newUploadedFiles = [];
      if (newFiles?.length) {
        newUploadedFiles = await Promise.all(
          newFiles.map(async (file) => {
            const { url, public_id } = await uploadToCloudinary(file.buffer);
            return {
              name: file.filename,
              type: file.mimetype,
              size: file.buffer.length,
              url,
              public_id,
            };
          })
        );
      }

      // Update project
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...data,
          files: newUploadedFiles.length ? {
            create: newUploadedFiles,
          } : undefined,
        },
        include: {
          author: true,
          files: true,
        },
      });

      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  static async deleteProject(projectId: string) {
    try {
      // Get all files to delete from Cloudinary
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { files: true },
      });

      if (!project) throw new Error('Project not found');

      // Delete all files from Cloudinary
      await Promise.all(
        project.files.map(file => deleteFromCloudinary(file.public_id))
      );

      // Delete project and related data from database
      await prisma.project.delete({
        where: { id: projectId },
      });

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  static async searchProjects(params: {
    query?: string;
    category?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    status?: ProjectStatus;
  }) {
    const { query, category, tags, page = 1, limit = 10, status = 'published' } = params;

    try {
      const conditions = {
        AND: [
          status ? { status } : undefined,
          category ? { category } : undefined,
          tags?.length ? { tags: { hasEvery: tags } } : undefined,
          query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          } : undefined,
        ].filter(Boolean),
      };

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where: conditions,
          include: {
            author: true,
            files: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({ where: conditions }),
      ]);

      return {
        projects,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page,
        },
      };
    } catch (error) {
      console.error('Error searching projects:', error);
      throw new Error('Failed to search projects');
    }
  }
}

// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const formData = await req.formData();
    
    // Validate request
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const files = formData.getAll('files') as File[];

    if (!title || !description || !category || !files.length) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate file types and sizes
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/zip',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return new NextResponse(`File type ${file.type} not allowed`, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return new NextResponse('File too large (max 10MB)', { status: 400 });
      }
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(
      files.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
        mimetype: file.type,
      }))
    );

    const project = await ProjectHandler.createProject(
      {
        title,
        description,
        category,
        tags,
        authorId: user.id,
        year: new Date().getFullYear(),
        status: 'published',
      },
      fileBuffers
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}