import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The layer, and the action that we do not run
const listUsers = vi.hoisted(() => vi.fn());
vi.mock("@/dal/admin", () => ({ listUsers }));
vi.mock("@/app/(app)/admin/actions", () => ({ changeRole: vi.fn() }));

import AdminUsers from "./AdminUsers";

beforeEach(() => {
  listUsers.mockReset();
});

describe("AdminUsers", () => {
  it("shows each user, with a role to choose", async () => {
    listUsers.mockResolvedValue([
      { id: 1, name: "Maya Chen", email: "maya@example.com", role: "admin" },
      { id: 2, name: "Tom Rivera", email: "tom@example.com", role: "user" },
    ]);
    render(await AdminUsers());
    expect(screen.getByText(/Maya Chen/)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByRole("combobox")[1]).toHaveValue("user");
  });

  it("lets the 403 through: no list is rendered", async () => {
    listUsers.mockImplementation(async () => {
      throw new Error("forbidden");
    });
    await expect(AdminUsers()).rejects.toThrow("forbidden");
  });

  it("lets the redirect through for a visitor", async () => {
    listUsers.mockImplementation(async () => {
      throw new Error("redirect /login");
    });
    await expect(AdminUsers()).rejects.toThrow("redirect /login");
  });
});
