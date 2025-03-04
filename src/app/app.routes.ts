// import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
// import { AboutComponent } from './pages/about/about.component';
// import { LoginComponent } from './pages/auth/login/login.component';
// import { RegisterComponent } from './pages/auth/register/register.component';
// import { ContactComponent } from './pages/contact/contact.component';
// import { DashboardAdminComponent} from './pages/admin/Admindashb/dashboard.component';
// import { authGuard } from './guards/auth.guard';
// import { DetailsComponent } from './pages/details/details.component';
// import { UsersComponent } from './pages/admin/users/users.component';
// import { ProductsComponent } from './pages/admin/products/products.component';
// import { CategoriesComponent } from './pages/admin/categories/categories.component';
// import { UpdateProductComponent } from './pages/admin/update-product/update-product.component';
// import { UpdateCategoryComponent } from './pages/admin/update-category/update-category.component';
// import { DashboardUserComponent } from './pages/Userdashb/dashboard.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'details/:id', component: DetailsComponent },
//   { path: 'about', component: AboutComponent },
//   { path: 'contact', component: ContactComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'users', component: UsersComponent },
//   { path: 'products', component: ProductsComponent },
//   { path: 'categories', component: CategoriesComponent },

//   { path: 'dashboard',component:DashboardUserComponent,
//     canActivate: [authGuard],
//   },

//   //Admin
//   {
//     path: 'admin',
//     component: DashboardAdminComponent,
//     canActivate: [authGuard],

//     children: [
//       { path: '', redirectTo: 'users', pathMatch: 'full' }, 
//       { path: 'users', component: UsersComponent },
//       { path: 'products', component: ProductsComponent },      
//       { path: 'update-product/:id', component: UpdateProductComponent},
//       { path: 'categories', component: CategoriesComponent },
//       { path: 'update-category/:id', component: UpdateCategoryComponent },

//     ],
//   },
 

// ];
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardAdminComponent } from './pages/admin/Admindashb/dashboard.component';
import { DetailsComponent } from './pages/details/details.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { UpdateProductComponent } from './pages/admin/update-product/update-product.component';
import { UpdateCategoryComponent } from './pages/admin/update-category/update-category.component';
import { DashboardUserComponent } from './pages/Userdashb/dashboard.component';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard]  },
  { path: 'register', component: RegisterComponent },
  
  // Dashboard utilisateur (seulement pour les utilisateurs normaux)
  {
    path: 'dashboard',
    component: DashboardUserComponent,
    canActivate: [userGuard], 
  },

  // Dashboard admin (seulement pour les admins)
  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [adminGuard], 
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'update-product/:id', component: UpdateProductComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'update-category/:id', component: UpdateCategoryComponent },
    ],
  },

  { path: '**', redirectTo: '/login' }, // Redirection pour toute route inconnue
];
