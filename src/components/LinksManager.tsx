import React, { useState } from 'react';
import { PlusIcon, LinkIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export interface Link {
  id: number;
  url: string;
  label?: string;
  companyId?: number;
  contactId?: number;
  jobApplicationId?: number;
  createdAt: string;
  updatedAt: string;
}

interface LinksManagerProps {
  links: Link[];
  entityType: 'company' | 'contact' | 'jobApplication';
  entityId: number;
  onLinksChange?: (links: Link[]) => void;
  className?: string;
}

const COMMON_LABELS = {
  company: [
    'Website',
    'LinkedIn Page',
    'Careers Page',
    'Glassdoor',
    'Crunchbase',
    'Instagram',
    'Twitter',
    'Facebook',
  ],
  contact: [
    'LinkedIn Profile',
    'Personal Website',
    'Portfolio',
    'Twitter',
    'GitHub',
    'Instagram',
    'Facebook',
  ],
  jobApplication: [
    'Job Posting',
    'Company Website',
    'Application Portal',
    'LinkedIn Job',
    'Job Board',
  ],
};

export default function LinksManager({
  links = [],
  entityType,
  entityId,
  onLinksChange,
  className = '',
}: LinksManagerProps) {
  const [localLinks, setLocalLinks] = useState<Link[]>(links);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLink, setNewLink] = useState({ url: '', label: '' });

  const updateLinks = (updatedLinks: Link[]) => {
    setLocalLinks(updatedLinks);
    onLinksChange?.(updatedLinks);
  };

  const handleAddLink = async () => {
    try {
      const payload = {
        url: newLink.url,
        label: newLink.label || null,
        [`${entityType}Id`]: entityId,
      };

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const createdLink = await response.json();
        const updatedLinks = [...localLinks, createdLink];
        updateLinks(updatedLinks);
        setNewLink({ url: '', label: '' });
        setIsAdding(false);
      } else {
        console.error('Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleUpdateLink = async (linkId: number, updatedData: { url: string; label: string }) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedLink = await response.json();
        const updatedLinks = localLinks.map((link) =>
          link.id === linkId ? updatedLink : link
        );
        updateLinks(updatedLinks);
        setEditingId(null);
      } else {
        console.error('Failed to update link');
      }
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedLinks = localLinks.filter((link) => link.id !== linkId);
        updateLinks(updatedLinks);
      } else {
        console.error('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const getBrandIcon = (url: string) => {
    const domain = url.toLowerCase();
    
    // LinkedIn
    if (domain.includes('linkedin.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    }
    
    // Twitter/X
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
      );
    }
    
    // GitHub
    if (domain.includes('github.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    }
    
    // Instagram
    if (domain.includes('instagram.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    }
    
    // Facebook
    if (domain.includes('facebook.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }
    
    // YouTube
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    
    // Glassdoor
    if (domain.includes('glassdoor.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm-1.5-19v7.5h3V3h-3zm0 18v-7.5h3V21h-3z"/>
        </svg>
      );
    }
    
    // Crunchbase
    if (domain.includes('crunchbase.com')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.6 0H2.4C1.08 0 0 1.08 0 2.4v19.2C0 22.92 1.08 24 2.4 24h19.2c1.32 0 2.4-1.08 2.4-2.4V2.4C24 1.08 22.92 0 21.6 0zM7.68 18.72H4.32V9.36h3.36v9.36zm-1.68-10.8c-1.08 0-1.92-.84-1.92-1.92s.84-1.92 1.92-1.92 1.92.84 1.92 1.92-.84 1.92-1.92 1.92zm13.68 10.8h-3.36v-4.8c0-1.32-.48-2.16-1.68-2.16-.96 0-1.44.6-1.68 1.2-.12.24-.12.6-.12.96v4.8H9.48s.048-7.68 0-8.52h3.36v1.2c.48-.72 1.32-1.8 3.24-1.8 2.4 0 4.2 1.56 4.2 4.92v4.2z"/>
        </svg>
      );
    }
    
    // Portfolio/Personal sites
    if (domain.includes('portfolio') || domain.includes('personal') || domain.includes('.dev') || domain.includes('.me')) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
        </svg>
      );
    }
    
    // Default web/link icon
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
      </svg>
    );
  };

  const renderLinkItem = (link: Link) => {
    const isEditing = editingId === link.id;

    if (isEditing) {
      return (
        <EditLinkForm
          key={link.id}
          link={link}
          onSave={(updatedData) => handleUpdateLink(link.id, updatedData)}
          onCancel={() => setEditingId(null)}
          commonLabels={COMMON_LABELS[entityType]}
        />
      );
    }

    return (
      <div
        key={link.id}
        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-lg">{getBrandIcon(link.url)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground truncate">
                {link.label || 'Link'}
              </span>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 truncate block"
            >
              {link.url}
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditingId(link.id)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Edit link"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteLink(link.id)}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete link"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <LinkIcon className="w-5 h-5 mr-2" />
          Links
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Link
          </button>
        )}
      </div>

      <div className="space-y-3">
        {localLinks.map(renderLinkItem)}

        {isAdding && (
          <AddLinkForm
            newLink={newLink}
            onChange={setNewLink}
            onSave={handleAddLink}
            onCancel={() => {
              setIsAdding(false);
              setNewLink({ url: '', label: '' });
            }}
            commonLabels={COMMON_LABELS[entityType]}
          />
        )}

        {localLinks.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <LinkIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm">No links added yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Add links to websites, social profiles, and other resources
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for adding new links
function AddLinkForm({
  newLink,
  onChange,
  onSave,
  onCancel,
  commonLabels,
}: {
  newLink: { url: string; label: string };
  onChange: (link: { url: string; label: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  commonLabels: string[];
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.url.trim()) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-secondary/50 rounded-lg border border-border">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            URL *
          </label>
          <input
            type="url"
            value={newLink.url}
            onChange={(e) => onChange({ ...newLink, url: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Label
          </label>
          <input
            type="text"
            value={newLink.label}
            onChange={(e) => onChange({ ...newLink, label: e.target.value })}
            placeholder="e.g., LinkedIn, Website"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {commonLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ ...newLink, label })}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Link
        </button>
      </div>
    </form>
  );
}

// Component for editing existing links
function EditLinkForm({
  link,
  onSave,
  onCancel,
  commonLabels,
}: {
  link: Link;
  onSave: (data: { url: string; label: string }) => void;
  onCancel: () => void;
  commonLabels: string[];
}) {
  const [editData, setEditData] = useState({
    url: link.url,
    label: link.label || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData.url.trim()) {
      onSave(editData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-accent/50 rounded-lg border border-border">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            URL *
          </label>
          <input
            type="url"
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
            required
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Label
          </label>
          <input
            type="text"
            value={editData.label}
            onChange={(e) => setEditData({ ...editData, label: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
            placeholder="e.g., LinkedIn, Website"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {commonLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setEditData({ ...editData, label })}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
