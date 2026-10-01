export interface MatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  colorClass: string;
  progressColorHex: string;
}

export function calculateSkillMatch(
  studentSkills: string[],
  requiredSkills: string[]
): MatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: studentSkills,
      missingSkills: [],
      colorClass: "bg-[#10B981] text-[#10B981]",
      progressColorHex: "#10B981",
    };
  }

  const normalizedStudentSkills = new Set(
    studentSkills.map((s) => s.trim().toLowerCase())
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of requiredSkills) {
    const norm = skill.trim().toLowerCase();
    if (normalizedStudentSkills.has(norm)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchPercentage = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  let colorClass = "bg-[#2563EB] text-[#2563EB]";
  let progressColorHex = "#2563EB";

  if (matchPercentage >= 80) {
    colorClass = "bg-[#10B981] text-[#10B981]";
    progressColorHex = "#10B981";
  } else if (matchPercentage >= 50) {
    colorClass = "bg-[#F59E0B] text-[#F59E0B]";
    progressColorHex = "#F59E0B";
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    colorClass,
    progressColorHex,
  };
}
