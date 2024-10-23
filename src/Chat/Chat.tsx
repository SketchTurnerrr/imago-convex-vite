import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function Chat() {
  const messages = useQuery(api.prompts.getUserPrompts);
  console.log("messages :", messages);

  return (
    <>
      <div className="border-t"></div>
    </>
  );
}
