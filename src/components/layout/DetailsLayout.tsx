import React from 'react';
import Header from './Header';

interface DetailsLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  headerSection?: React.ReactNode;
  className?: string;
}

export default function DetailsLayout({
  leftColumn,
  rightColumn,
  headerSection,
  className = '',
}: DetailsLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        {/* Header Section */}
        {headerSection && (
          <div className="mb-8">
            {headerSection}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 gap-x-0 lg:gap-x-8">
          {/* Left Column: Profile/Info Card */}
          <div className="col-span-1">
            {leftColumn}
          </div>

          {/* Right Column: Main Content */}
          <div className="col-span-2 flex flex-col gap-8 gap-x-0 lg:gap-x-8">
            {rightColumn}
          </div>
        </div>
      </div>
    </div>
  );
}
