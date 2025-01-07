import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const RoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('auth-token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = token.split('.')[1];
    const decodedToken = JSON.parse(atob(payload));
    const userRole = decodedToken.role;

    const requiredRole = route.data['role'];

    if (userRole === requiredRole) {
      return true;
    }

    switch (userRole) {
      case 'ADMIN':
        router.navigate(['/admin']);
        break;
      case 'MEMBER':
        router.navigate(['/member']);
        break;
      case 'JURY':
        router.navigate(['/jury']);
        break;
      default:
        router.navigate(['/login']);
    }

    return false;

  } catch (error) {
    console.error('Error decoding token:', error);
    router.navigate(['/login']);
    return false;
  }
};
