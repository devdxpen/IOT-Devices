"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Trash2, Copy, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageWidget({ data, id }: NodeProps) {
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
  );
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <Card className="w-64 p-4 shadow-lg border-2 border-teal-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-teal-600" size={20} />
          <span className="font-semibold text-sm">Image Display</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Copy size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden bg-gray-100 mb-3">
        {isLoaded ? (
          <img
            src={imageUrl}
            alt="Widget image"
            className="w-full h-32 object-cover"
            onError={() => setIsLoaded(false)}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400">
            <ImageIcon size={40} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link size={14} className="text-gray-400" />
        <Input
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setIsLoaded(true);
          }}
          placeholder="Enter image URL..."
          className="h-8 text-xs"
        />
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-medium ${isLoaded ? "text-green-600" : "text-red-600"}`}
          >
            {isLoaded ? "Loaded" : "Error"}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
