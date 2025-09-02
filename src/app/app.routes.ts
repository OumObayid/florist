
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/adminDashboard.component';
import {  ProductDetailsComponent } from './pages/product-details/productDetails.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { AdminProductsComponent } from './pages/admin/admin-products/adminProducts.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories/adminCategories.component';
import { UpdateProductComponent } from './pages/admin/update-product/updateProduct.component';
import { UpdateCategoryComponent } from './pages/admin/update-category/updateCategory.component';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { ProductsComponent } from './pages/products/products.component';
import { CategorieDetailsComponent } from './pages/categorie-details/categorie-details.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { UserLayoutComponent } from './components/layouts/user-layout/userLayout.component';
import { OrderComponent } from './pages/user/order/order.component';
import { ProfilComponent } from './pages/user/profil/profil.component';
import { DashboardUserComponent } from './pages/user/dashboard-user/dashboardUser.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/adminOrders.component';
import { AdminLayoutComponent } from './components/layouts/admin-layout/adminLayout.component';
import { SettingComponent } from './pages/user/setting/setting.component';
import { AdminSettingsComponent } from './pages/admin/admin-settings/admin-settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categorie-details/:id', component: CategorieDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent },

  // Dashboard utilisateur (seulement pour les utilisateurs normaux)
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardUserComponent },
      { path: 'order', component: OrderComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'settings', component: SettingComponent },
    ],
    canActivate: [userGuard],
  },

  // Dashboard admin (seulement pour les admins)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'update-product/:id', component: UpdateProductComponent },
      { path: 'update-category/:id', component: UpdateCategoryComponent },
    ],
  },

  { path: '**', redirectTo: '/login' }, // Redirection pour toute route inconnue
];
