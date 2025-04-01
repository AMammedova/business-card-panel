"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { z } from "zod";

// Schema definitions
export const createCompanySchema = z.object({
  companyLocalizationDtos: z.array(
    z.object({
      name: z.string().min(1, "Company name is required"),
      slogan: z.string().optional(),
      info: z.string().optional(),
      email: z.string().email("Invalid email"),
      location: z.string().min(1, "Location is required"),
      phoneNumber: z.string().min(1, "Phone number is required"),
      language: z.enum(["az", "en", "ru"]),
    })
  ),
  isShow: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
});

export const updateCompanySchema = z.object({
  updateCompanyLocalizationDto: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Company name is required"),
      slogan: z.string().optional(),
      info: z.string().optional(),
      email: z.string().email("Invalid email"),
      location: z.string().min(1, "Location is required"),
      phoneNumber: z.string().min(1, "Phone number is required"),
      language: z.enum(["az", "en", "ru"]),
    })
  ),
  isShow: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
});

// Status Select Component
interface CompanyStatusSelectProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const CompanyStatusSelect: React.FC<CompanyStatusSelectProps> = ({ value, onChange }) => (
  <div>
    <label className="text-sm font-medium">Show Company</label>
    <Select onValueChange={(val) => onChange(val === "true")} value={value ? "true" : "false"}>
      <SelectTrigger>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Yes</SelectItem>
        <SelectItem value="false">No</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default CompanyStatusSelect;
