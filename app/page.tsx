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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-stone-100">
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-800 via-stone-700 to-emerald-800 bg-clip-text text-transparent">
            Sacred Journal
          </h1>
          <p className="text-xl sm:text-2xl text-stone-700 mb-4">
            Transformation of consciousness is the basis for all transformation
          </p>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            A sacred space for deep reflection and personal growth. Voice-first journaling
            that honors your inner wisdom, challenges you to grow, and helps you develop
            your personal constitution—your principles for living with integrity.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
        >
          {[
            { value: "Gratitude", description: "Recognize the gifts in every moment" },
            { value: "Service", description: "Support the growth of others" },
            { value: "Growth", description: "Transform and uplift consciousness" },
            { value: "Responsibility", description: "Own your choices and actions" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-4 text-center"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-emerald-800 mb-1">
                {item.value}
              </h3>
              <p className="text-sm text-stone-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
        >
          {[
            {
              icon: "🌿",
              title: "Voice-First Reflection",
              description:
                "Close your eyes and speak from the heart. Real-time conversation with an AI guide that listens deeply, asks probing questions, and challenges you to grow—like a wise friend who cares enough to be honest.",
            },
            {
              icon: "🔥",
              title: "Personal Constitution",
              description:
                "Develop your core principles and values—a living document that guides your decisions. Like the Yawanawá Life Plan, it connects you to your own wisdom and keeps you aligned with who you truly want to be.",
            },
            {
              icon: "🌊",
              title: "Working Memory",
              description:
                "Your journal partner remembers what matters to you—people, goals, concerns. It connects your current reflections to your past, creating a continuous thread of growth and accountability.",
            },
            {
              icon: "🦋",
              title: "Personality-Aware Guidance",
              description:
                "Based on your unique psychological profile, receive guidance tailored to how you process information and make decisions. Not generic advice, but communication that resonates with your nature.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow border border-stone-200"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-stone-900">
                {feature.title}
              </h3>
              <p className="text-stone-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Statement */}
        <motion.div
          className="mb-12 p-8 bg-emerald-900 text-white rounded-lg text-center"
          variants={itemVariants}
        >
          <p className="text-lg italic mb-4">
            "The greatest wealth is in this way of life—in the wisdom held by our elders,
            in the connection to ourselves and each other, in harmony with the rhythms of life."
          </p>
          <p className="text-sm text-emerald-200">
            Inspired by indigenous wisdom traditions that teach us to honor relationship,
            responsibility, reciprocity, and balance in all things.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
          >
            Begin Your Journey
          </Link>
          <Link
            href="/auth/signin"
            className="px-8 py-4 bg-white text-emerald-800 border-2 border-emerald-800 rounded-lg font-semibold hover:bg-emerald-50 transition-all"
          >
            Continue Your Path
          </Link>
        </motion.div>

        {/* Approach */}
        <motion.div
          className="mt-16 p-6 bg-white rounded-lg border border-stone-200 shadow-md"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold mb-4 text-stone-900">
            Our Approach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-emerald-800 mb-2">Not a Sycophant</h4>
              <p className="text-stone-600">
                Your AI guide challenges assumptions, names avoidance, and asks about your
                role in situations. Growth requires honest reflection, not empty validation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800 mb-2">Deep Listening</h4>
              <p className="text-stone-600">
                Every response draws from your history, principles, and personality.
                Your guide connects present to past, showing patterns and progress.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800 mb-2">Sacred Container</h4>
              <p className="text-stone-600">
                This space is held with intention. Your reflections are private,
                encrypted, and treated with the respect they deserve.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
