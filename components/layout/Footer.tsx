import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Footer() {
    const footerSections = [
        {
            title: 'About',
            links: [
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Documentation', path: '/docs' },
                { name: 'Guidelines', path: '/guidelines' },
                { name: 'Support', path: '/support' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Use', path: '/terms' },
                { name: 'Copyright', path: '/copyright' },
            ],
        },
        {
            title: 'Connect',
            links: [
                { name: 'Twitter', path: 'https://twitter.com' },
                { name: 'LinkedIn', path: 'https://linkedin.com' },
                { name: 'GitHub', path: 'https://github.com' },
            ],
        },
    ];

    return (
        <footer className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        {link.path.startsWith('http') ? (
                                            <a
                                                href={link.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link href={link.path} passHref>
                                                <Button className='p-0' variant="link">{link.name}</Button>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t text-center text-gray-600">
                    <p>© {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
