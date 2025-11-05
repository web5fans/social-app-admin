import useGetTemplate from "@/store/template.ts";
import { useEffect } from "react";

export default function useTemplates() {
  const { templates, fetchTemplate } = useGetTemplate()

  useEffect(() => {
    if (!templates) fetchTemplate()
  }, []);

  return {
    templates,
    fetchTemplate
  }
}