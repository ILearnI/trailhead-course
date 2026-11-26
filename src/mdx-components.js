import Callout from "@/components/Callout";

// Components that every .mdx file can use
export function useMDXComponents(components) {
  return {
    Callout,
    // Style the tags that Markdown makes
    p: (props) => <p className="mt-4 leading-7" {...props} />,
    ul: (props) => <ul className="mt-4 list-disc pl-6" {...props} />,
    ...components,
  };
}
