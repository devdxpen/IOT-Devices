"use client";

import {
  IoNotificationsOutline,
  IoExpandOutline,
  IoMoonOutline,
  IoAddOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-blue-500">LINKED</span>
          <span className="text-neutral-700">IOT</span>
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Add Device Button */}
        <Button className="h-9 bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm">
          <IoAddOutline className="w-4 h-4" />
          <span>Add Device</span>
        </Button>

        {/* Fullscreen Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <IoExpandOutline className="w-5 h-5 text-neutral-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Fullscreen</TooltipContent>
        </Tooltip>

        {/* Dark Mode Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <IoMoonOutline className="w-5 h-5 text-neutral-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Dark Mode</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <IoNotificationsOutline className="w-5 h-5 text-neutral-600" />
              </button>
              <Badge className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-500 text-white text-[10px] h-5 min-w-5 flex items-center justify-center px-1.5 border-2 border-white">
                30
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Notifications</TooltipContent>
        </Tooltip>

        {/* User Profile Separator */}
        <div className="w-px h-8 bg-neutral-200 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-9 h-9 ring-2 ring-neutral-100">
              <AvatarImage src="/avatar.jpg" alt="Anna Adams" />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm font-medium">
                AA
              </AvatarFallback>
            </Avatar>
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-900 leading-tight">
              Anna Adams
            </span>
            <span className="text-xs text-neutral-500">Founder</span>
          </div>
        </div>
      </div>
    </header>
  );
}
