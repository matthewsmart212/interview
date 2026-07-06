"use client";

import { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import { USER } from "../../lib/app-data";

export default function PersonalizedPageHeader({
  icon = "home",
  titlePrefix = "Hi",
  titleSuffix = " 👋",
  description,
  descriptionFallback,
  ...props
}) {
  const [name, setName] = useState(USER.name);

  useEffect(() => {
    const profile = loadProfile();
    if (profile?.name?.trim()) {
      setName(getFirstName(profile));
    }
  }, []);

  const resolvedDescription =
    description ??
    descriptionFallback ??
    "What would you like to prepare for?";

  return (
    <PageHeader
      icon={icon}
      title={`${titlePrefix} ${name}${titleSuffix}`}
      description={resolvedDescription}
      {...props}
    />
  );
}
