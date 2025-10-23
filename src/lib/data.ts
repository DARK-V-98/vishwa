
import { Code, Briefcase, Award, Users, ShoppingBag, Palette, FileText, CheckCircle, Clock } from 'lucide-react';

export const profile = {
  name: 'Vishwa LK',
  title: 'Full-Stack Developer & UI/UX Designer',
  bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences. With over 5 years in the industry, I turn complex problems into elegant solutions.',
};

export const skills = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python',
  'UI/UX Design', 'Figma', 'Generative AI', 'Firebase', 'PostgreSQL'
];

export const experience = [
  {
    role: 'Lead Developer',
    company: 'ESystemLK',
    period: '2021 - Present',
    description: 'Leading development of web and mobile applications, focusing on clean architecture and scalable solutions.'
  },
  {
    role: 'Software Engineer',
    company: 'Innovate Tech',
    period: '2019 - 2021',
    description: 'Developed and maintained client-side applications for various clients in the e-commerce and finance sectors.'
  }
];

export const achievements = [
  {
    title: 'Best UI/UX Award 2023',
    description: 'Recognized for outstanding design on a major e-commerce platform.'
  },
  {
    title: 'Published AI Author',
    description: 'Co-authored a paper on the practical applications of generative AI in business automation.'
  }
];

export const services = [
  {
    title: 'Web Development',
    description: 'Crafting responsive, high-performance websites and web applications tailored to your business needs.',
    icon: Code
  },
  {
    title: 'Custom Software Solutions',
    description: 'Building bespoke software from the ground up to solve unique business challenges and streamline operations.',
    icon: Briefcase
  },
  {
    title: 'Logo & Post Design',
    description: 'Creating memorable logos and engaging social media posts that define and elevate your brand identity.',
    icon: Palette
  },
  {
    title: 'AI-Powered Quotations',
    description: 'Leveraging generative AI to provide fast, accurate, and detailed project quotations for your convenience.',
    icon: FileText
  }
];

export const products = [
  { id: '1', name: 'Modern Smartwatch', price: 299.99, imageId: 'marketplace-product-1', category: 'electronics' },
  { id: '2', name: 'Wireless Headphones', price: 149.50, imageId: 'marketplace-product-2', category: 'audio' },
  { id: '3', name: 'Ergonomic Keyboard', price: 89.99, imageId: 'marketplace-product-3', category: 'accessories' },
  { id: '4', name: 'Graphics Tablet', price: 399.00, imageId: 'marketplace-product-4', category: 'design' },
  { id: '5', name: 'Portable SSD', price: 120.00, imageId: 'marketplace-product-5', category: 'storage' },
  { id: '6', name: 'Condenser Microphone', price: 180.75, imageId: 'marketplace-product-6', category: 'audio' },
];

export const adminListings = [
  { id: 'prod_001', name: 'Modern Smartwatch', seller: 'Alice Johnson', price: 299.99, status: 'Active' },
  { id: 'prod_002', name: 'Wireless Headphones', seller: 'Bob Williams', price: 149.50, status: 'Pending' },
  { id: 'prod_003', name: 'Ergonomic Keyboard', seller: 'Charlie Brown', price: 89.99, status: 'Active' },
];

export const adminOrders = [
  { id: 'ord_001', type: 'Logo Design', client: 'Tech Corp', status: 'In Progress', created: '2023-08-01' },
  { id: 'ord_002', type: 'Post Design', client: 'Gourmet Foods', status: 'Completed', created: '2023-07-25' },
  { id: 'ord_003', type: 'Logo Design', client: 'Innovate Startup', status: 'Pending', created: '2023-08-05' },
];
