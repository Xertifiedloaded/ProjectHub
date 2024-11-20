
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProjectMetadataProps } from '@/type/card';

export function ProjectDetails({ data, onUpdate }: ProjectMetadataProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Title</label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter your project title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={data?.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your project"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Input
            type="number"
            value={data.year}
            onChange={(e) => onUpdate({ year: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={data.category}
            onValueChange={(value) => onUpdate({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thesis">Thesis</SelectItem>
              <SelectItem value="final-year-project">
                Final Year Project
              </SelectItem>
              <SelectItem value="research-paper">
                Research Paper
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}