"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesList } from "./notes-list";
import { FaqsList } from "./faqs-list";
import { DocumentsList } from "./documents-list";
import { FileText, HelpCircle, FolderOpen } from "lucide-react";

export const KnowledgeHub = () => {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="notes" className="h-full flex flex-col">
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="size-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="size-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FolderOpen className="size-4" />
              Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notes" className="flex-1 m-0">
          <NotesList />
        </TabsContent>

        <TabsContent value="faqs" className="flex-1 m-0">
          <FaqsList />
        </TabsContent>

        <TabsContent value="documents" className="flex-1 m-0">
          <DocumentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
