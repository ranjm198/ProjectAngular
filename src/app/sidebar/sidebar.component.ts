import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule,  CommonModule,
    FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      icon: 'fas fa-home',
      label: 'Dashboard',
      isOpen: false,
      children: [
        { icon: 'fas fa-chart-pie', label: 'Analytics' },
        { icon: 'fas fa-tasks', label: 'Projects' },
      ]
    },
    {
      icon: 'fas fa-cog',
      label: 'Settings',
      isOpen: false,
      children: [
        { icon: 'fas fa-user', label: 'Profile' },
        { icon: 'fas fa-lock', label: 'Security' },
      ]
    },
    {
      icon: 'fas fa-envelope',
      label: 'Messages'
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
