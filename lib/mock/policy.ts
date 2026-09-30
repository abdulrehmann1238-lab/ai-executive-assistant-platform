import { Task, ApprovalItem, ActivityEvent } from "./db";

export type Role = "Owner" | "Chief of Staff" | "Finance lead" | "Contractor";

export interface RoleCapability {
  canApprove: boolean;
  canEdit: boolean;
  canViewRestricted: boolean;
  allowedCompanies: string[]; // "all", "northgate", "ashby", "kestrel"
}

export const ROLE_CAPABILITIES: Record<Role, RoleCapability> = {
  Owner: {
    canApprove: true,
    canEdit: true,
    canViewRestricted: true,
    allowedCompanies: ["all", "northgate", "ashby", "kestrel"],
  },
  "Chief of Staff": {
    canApprove: false, // can draft/review but final send requires Owner
    canEdit: true,
    canViewRestricted: false, // only items with "Chief of Staff"
    allowedCompanies: ["all", "northgate", "ashby", "kestrel"],
  },
  "Finance lead": {
    canApprove: false,
    canEdit: true,
    canViewRestricted: false,
    allowedCompanies: ["all", "northgate", "kestrel"],
  },
  Contractor: {
    canApprove: false,
    canEdit: false,
    canViewRestricted: false,
    allowedCompanies: ["ashby"],
  },
};

export function canSeeTask(role: Role, task: Task): boolean {
  if (role === "Owner") return true;

  // Company scope check
  if (role === "Finance lead") {
    if (task.companyId === "ashby") return false;
  }
  if (role === "Contractor") {
    // Ruth Okafor perspective: allowed only specific assigned tasks or explicitly permitted items
    if (task.id === "T-901" || task.id === "T-301") return true;
    return false;
  }

  // Restricted check
  if (task.isRestricted) {
    if (role === "Chief of Staff" && task.visibleToRoleIds?.includes("Chief of Staff")) {
      return true;
    }
    return false;
  }

  return true;
}

export function canSeeApproval(role: Role, item: ApprovalItem): boolean {
  if (role === "Owner") return true;

  if (role === "Finance lead") {
    if (item.companyId === "ashby") return false;
  }
  if (role === "Contractor") {
    if (item.id === "A-505" || item.id === "A-502") return true;
    return false;
  }

  if (item.isRestricted) {
    if (role === "Chief of Staff" && item.visibleToRoleIds?.includes("Chief of Staff")) {
      return true;
    }
    return false;
  }

  return true;
}

export function canSeeActivity(role: Role, event: ActivityEvent): boolean {
  if (role === "Owner") return true;

  if (role === "Finance lead") {
    if (event.companyId === "ashby") return false;
  }
  if (role === "Contractor") {
    if (event.id === "act-11" || event.actorName.includes("Ruth")) return true;
    return false;
  }

  if (event.payload?.policy?.includes("restricted") || event.object?.includes("restricted")) {
    return false;
  }

  return true;
}

export function canApproveAction(role: Role): boolean {
  return role === "Owner";
}

export function getSimulatedRLS(role: Role, entity: "tasks" | "approvals" | "activity"): string {
  switch (role) {
    case "Owner":
      return `-- Policy: owner_full_access_policy ON ${entity}
CREATE POLICY "owner_full_access" ON public.${entity}
FOR ALL TO authenticated
USING (
  auth.jwt() ->> 'role' = 'Owner'
  OR (
    auth.uid() = 'usr_elena_marchetti'
    AND EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  )
);
-- Result: FULL ROW VISIBILITY (Tenant Bypass: ALLOWED)`;

    case "Chief of Staff":
      return `-- Policy: chief_of_staff_broad_policy ON ${entity}
CREATE POLICY "chief_of_staff_scope" ON public.${entity}
FOR SELECT TO authenticated
USING (
  auth.jwt() ->> 'role' = 'Chief of Staff'
  AND (
    is_restricted = false
    OR auth.jwt() ->> 'role' = ANY(visible_to_roles)
  )
);
-- Result: All companies visible. Items restricted to Owner/Legal are REDACTED.`;

    case "Finance lead":
      return `-- Policy: tenant_finance_scoping ON ${entity}
CREATE POLICY "finance_lead_tenant_boundary" ON public.${entity}
FOR SELECT TO authenticated
USING (
  company_id IN ('northgate', 'kestrel')
  AND is_restricted = false
  AND auth.uid() IN (
    SELECT user_id FROM public.company_memberships
    WHERE company_id IN ('northgate', 'kestrel')
  )
);
-- Result: Ashby & Vale rows hidden. Restricted items hidden.`;

    case "Contractor":
      return `-- Policy: contractor_least_privilege ON ${entity}
CREATE POLICY "contractor_specific_assignment" ON public.${entity}
FOR SELECT TO authenticated
USING (
  auth.uid() = assigned_to_user_id
  OR auth.uid() = ANY(visible_to_users)
);
-- Result: Strictly isolated to assigned items (e.g. Ruth Okafor legal items).`;
  }
}
