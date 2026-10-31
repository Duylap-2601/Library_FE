import React from 'react';

export const TemplateCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-[8px] border border-line bg-paper">
      <div className="aspect-[16/10] w-full bg-active" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-1/3 rounded-[2px] bg-active" />
        <div className="h-4 w-3/4 rounded-[2px] bg-active" />
        <div className="h-3 w-full rounded-[2px] bg-rule" />
        <div className="h-3 w-5/6 rounded-[2px] bg-rule" />
      </div>
      <div className="flex h-11 items-center justify-between border-t border-rule px-3">
        <div className="h-3 w-16 rounded-[2px] bg-active" />
        <div className="h-3 w-14 rounded-[2px] bg-active" />
      </div>
    </div>
  );
};

export const PreviewSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center bg-well p-8">
      <div className="w-full max-w-[760px] border border-line bg-paper p-10">
        <div className="space-y-3">
          <div className="h-6 w-2/3 rounded-[2px] bg-active" />
          <div className="h-3 w-full rounded-[2px] bg-rule" />
          <div className="h-3 w-full rounded-[2px] bg-rule" />
          <div className="h-3 w-4/5 rounded-[2px] bg-rule" />
          <div className="pt-6">
            <div className="h-3 w-full rounded-[2px] bg-rule" />
            <div className="mt-2 h-3 w-11/12 rounded-[2px] bg-rule" />
            <div className="mt-2 h-3 w-3/4 rounded-[2px] bg-rule" />
          </div>
        </div>
      </div>
    </div>
  );
};
