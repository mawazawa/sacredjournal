"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-sacred-purple-600 via-sacred-teal-600 to-sacred-purple-600 bg-clip-text text-transparent">
            Sacred Journal
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-4">
            Your personality-aware AI coaching journaling companion
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Multimodal journaling with voice, email, text, and image inputs.
            Real-time AI coaching powered by Gemini. Knowledge graph pattern
            recognition. Personality-aware persuasion strategies.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
        >
          {[
            {
              icon: "🎤",
              title: "Voice-First Journaling",
              description:
                "Real-time conversation with AI coach using Gemini Live API. Eyes-closed, voice-first interactions to reduce screen time.",
            },
            {
              icon: "📧",
              title: "Email Integration",
              description:
                "Email yourself or CC sacredjournal@app. Entries automatically transcribed and added to your knowledge graph.",
            },
            {
              icon: "🧠",
              title: "Personality Aware",
              description:
                "Big Five personality profiling. AI coaching tailored to your unique personality type using proven persuasion strategies.",
            },
            {
              icon: "🕸️",
              title: "Knowledge Graph",
              description:
                "Neo4j-powered relationship mapping. Visualize your friend networks, time allocation, and goal dependencies.",
            },
            {
              icon: "📸",
              title: "Image & OCR",
              description:
                "Upload physical journal photos. Mistral OCR automatically transcribes handwritten notes with 95%+ accuracy.",
            },
            {
              icon: "📊",
              title: "Screen Time Metrics",
              description:
                "Measure success by screen time reduction. Get insights on eyes-closed meditation and voice-first usage.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-gradient-to-r from-sacred-purple-600 to-sacred-purple-700 text-white rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
          >
            Start Your Journey
          </Link>
          <Link
            href="/docs"
            className="px-8 py-4 bg-white text-sacred-purple-600 border-2 border-sacred-purple-600 rounded-lg font-semibold hover:bg-sacred-purple-50 transition-all"
          >
            Explore Documentation
          </Link>
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          className="mt-16 p-6 bg-white rounded-lg border border-gray-200 shadow-md"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Modern Tech Stack (November 2025)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS 4",
              "Zustand",
              "React Query",
              "Supabase",
              "Gemini 3 Pro",
              "DeepGram Nova-3",
              "Neo4j",
              "Framer Motion",
              "Recharts",
            ].map((tech) => (
              <div
                key={tech}
                className="px-3 py-2 bg-sacred-purple-100 text-sacred-purple-700 rounded-md text-center font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
