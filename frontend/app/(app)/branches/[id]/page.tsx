'use client';

import { use } from 'react';
import { BranchDetails } from '@/features/branch';

interface BranchDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BranchDetailsPage({ params }: BranchDetailsPageProps) {
  const resolvedParams = use(params);
  return <BranchDetails branchId={resolvedParams.id} />;
}