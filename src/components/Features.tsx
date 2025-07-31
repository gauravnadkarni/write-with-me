'use client'

import { Cloud, Download, Folder, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: Lightbulb,
    gradient: 'from-blue-500 to-sky-400',
    title: 'Real-Time Grammar & Style Suggestions',
    description:
      'Get instant feedback on grammar, tone, and sentence structure as you type. Our AI ensures your writing is polished, professional, and error-free',
  },
  {
    icon: Folder,
    gradient: 'from-primary to-indigo-500',
    title: 'Organize Drafts with Single-Level Folders',
    description:
      'Keep your work structured by organizing drafts into intuitive single-level folders. Perfect for separating personal projects, work tasks, or school assignments',
  },
  {
    icon: Download,
    gradient: 'from-indigo-500 to-violet-700',
    title: 'Export in Multiple Formats',
    description:
      "Effortlessly export your writing in PDF or Markdown formats. Whether you're sharing with clients, publishing online, or collaborating with developers, we’ve got you covered.",
  },
  {
    icon: Cloud,
    gradient: 'from-primary to-blue-800',
    title: 'Auto-Save and Cloud Sync',
    description:
      'Never lose your progress again. All your drafts are automatically saved to the cloud, allowing you to resume writing from any device at any time.',
  },
]

export const Features = () => {
  return (
    <section id="features" className="section bg-secondary/50">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="heading-lg mb-6">
            Everything You Need to Write Better
          </h2>
          <p className="text-lg text-foreground/70">
            WriteWithMe combines powerful tools with elegant design to help you
            write with clarity, organization, and style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-8 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-md"
            >
              <div
                className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-xl inline-flex items-center justify-center mb-6`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
