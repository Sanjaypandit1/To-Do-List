"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { CheckCircle, BarChart3, FolderOpen, ArrowRight, Backpack } from "lucide-react-native"

interface OnboardingScreenProps {
  onComplete: () => void
}

const onboardingSteps = [
  {
    id: 1,
    title: "Organize Your Tasks",
    description:
      "Create, manage, and track your daily tasks with ease. Stay productive and never miss important deadlines.",
    icon: CheckCircle,
    color: "#2563eb",
  },
  {
    id: 2,
    title: "Smart Categories",
    description:
      "Group your tasks by categories like Work, Personal, or Projects. Keep everything organized and find tasks quickly.",
    icon: FolderOpen,
    color: "#3b82f6",
  },
  {
    id: 3,
    title: "Track Your Progress",
    description:
      "View detailed statistics about your productivity. See how many tasks you complete and track your improvement over time.",
    icon: BarChart3,
    color: "#2563eb",
  },
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentStepData = onboardingSteps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>TaskFlow</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
            <Backpack size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[styles.progressDot, index <= currentStep ? styles.progressDotActive : styles.progressDotInactive]}
            />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <IconComponent size={80} color={currentStepData.color} />
          </View>

          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featureGrid}>
          {onboardingSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.featureCard,
                index === currentStep ? styles.featureCardActive : styles.featureCardInactive,
              ]}
            >
              <step.icon size={24} color={index === currentStep ? "#ffffff" : step.color} />
              <Text
                style={[
                  styles.featureCardText,
                  index === currentStep ? styles.featureCardTextActive : styles.featureCardTextInactive,
                ]}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2563eb", // Changed from green to blue
    fontFamily: "GeistSans",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skipText: {
    fontSize: 16,
    color: "#6b7280",
    fontFamily: "GeistSans",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 60,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: "#2563eb", // Changed from green to blue
  },
  progressDotInactive: {
    backgroundColor: "#e5e7eb",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "GeistSans",
  },
  stepDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
    fontFamily: "GeistSans",
  },
  featureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  featureCardActive: {
    backgroundColor: "#2563eb", // Changed from green to blue
  },
  featureCardInactive: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  featureCardText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "GeistSans",
  },
  featureCardTextActive: {
    color: "#ffffff",
  },
  featureCardTextInactive: {
    color: "#475569",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: "#2563eb", // Changed from green to blue
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: "GeistSans",
  },
})
