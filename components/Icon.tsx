"use client";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

export default function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = (Icons as any)[name] || Icons.Circle;
  return <Cmp {...props} />;
}
