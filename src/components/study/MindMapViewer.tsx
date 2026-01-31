import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";

interface MindMapNode {
  name: string;
  children: MindMapNode[];
}

interface MindMapData {
  central: string;
  branches: MindMapNode[];
}

export const MindMapViewer = ({ bookId, chapterName }: { bookId: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [mindmap, setMindmap] = useState<MindMapData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMindMap();
  }, [bookId, chapterName]);

  const loadMindMap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "mindmap", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setMindmap(data.material.content);
      }
    } catch (error) {
      console.error("Error loading mind map:", error);
      toast({
        title: "Error",
        description: "Failed to load mind map. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderNode = (node: MindMapNode, level: number = 0) => {
    const colors = [
      "bg-primary/10 border-primary",
      "bg-secondary/10 border-secondary",
      "bg-accent/10 border-accent",
      "bg-muted border-muted-foreground",
    ];
    const colorClass = colors[level % colors.length];

    return (
      <div key={node.name} className={`ml-${level * 8} my-2`}>
        <div
          className={`inline-block px-4 py-2 rounded-lg border-2 ${colorClass} font-medium`}
        >
          {node.name}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="ml-8 mt-2 border-l-2 border-muted-foreground/20 pl-4">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating mind map...</p>
      </div>
    );
  }

  if (!mindmap) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No mind map available.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl text-xl font-bold shadow-lg">
          {mindmap.central}
        </div>
      </div>

      <div className="space-y-4">
        {mindmap.branches.map((branch) => renderNode(branch, 0))}
      </div>
    </div>
  );
};
