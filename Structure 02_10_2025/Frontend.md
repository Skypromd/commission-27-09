.
├── locales/
│   ├── en/
│   │   ├── article-details.json
│   │   ├── article.json
│   │   ├── profile.json
│   │   └── translation.json
│   └── ru/
│       ├── article-details.json
│       ├── article.json
│       ├── profile.json
│       └── translation.json
├── favicon.ico
├── index.html
├── manifest.json
├── mockServiceWorker.js
├── offline.html
├── robots.txt
├── sw.js
├── src/
│   ├── __tests__/
│   │   ├── Clients.test.tsx
│   │   └── Dashboard.test.tsx
│   ├── components/
│   │   ├── Dashboard.test.tsx
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── app/
│   │   │   ├── App.test.tsx
│   │   │   ├── providers/
│   │   │   ├── router/
│   │   │   │   └── config/
│   │   │   │       └── routeConfig.tsx
│   │   │   ├── ui/
│   │   │   │   ├── AppRouter.tsx
│   │   │   │   └── RequireAuth.tsx
│   │   │   └── StoreProvider/
│   │   │       └── config/
│   │   │           └── StateSchema.ts
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   └── AIInsightsPanel.tsx
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── common/
│   │   │   │   ├── AdminLanguageSettings.tsx
│   │   │   │   ├── DateRangePicker.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ErrorMessage.tsx
│   │   │   │   ├── LanguageSelector.tsx
│   │   │   │   ├── LanguageSettings.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Notification.tsx
│   │   │   │   ├── OfflineIndicator.tsx
│   │   │   │   ├── ResourceTable.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── ToastContainer.tsx
│   │   │   │   └── UpdateNotification.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── DealsByStatusChart.tsx
│   │   │   │   └── Dashboard.css
│   │   │   ├── examples/
│   │   │   │   └── ModernFinancials.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── UniversalLayout.tsx
│   │   │   ├── mobile/
│   │   │   │   └── MobileApp.tsx
│   │   │   └── ui/
│   │   │       ├── AnimatedButton.tsx
│   │   │       ├── AnimatedCard.tsx
│   │   │       ├── AnimatedCharts.tsx
│   │   │       ├── AnimatedControls.tsx
│   │   │       ├── AnimatedDataTable.tsx
│   │   │       ├── AnimatedDropdown.tsx
│   │   │       ├── AnimatedForm.tsx
│   │   │       ├── AnimatedModal.tsx
│   │   │       ├── AnimatedNavigation.tsx
│   │   │       ├── AnimatedToast.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── DataTable.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── index.ts
│   │   │       ├── LiveActivityFeed.tsx
│   │   │       ├── LoadingSpinner.css
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── NotificationBell.tsx
│   │   ├── AppRouter.tsx
│   │   ├── EnhancedDashboard.tsx
│   │   ├── LazyComponents.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ProtectedRoutes.tsx
│   │   ├── ResourceFormModal.tsx
│   │   └── ResourcePage.tsx
│   │   └── config/
│   │       └── api.ts
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── NotificationContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── entities/
│   │   │   ├── Article/
│   │   │   │   ├── model/
│   │   │   │   │   ├── selectors/
│   │   │   │   │   │   └── articleDetails.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── fetchArticleById/
│   │   │   │   │   │       └── fetchArticleById.ts
│   │   │   │   │   ├── slice/
│   │   │   │   │   │   └── articleDetailsSlice.ts
│   │   │   │   │   └── types/
│   │   │   │   │       ├── article.ts
│   │   │   │   │       └── articleDetailsSchema.ts
│   │   │   │   └── ui/
│   │   │   │       ├── ArticleCodeBlockComponent/
│   │   │   │       │   ├── ArticleCodeBlockComponent.module.scss
│   │   │   │       │   └── ArticleCodeBlockComponent.tsx
│   │   │   │       ├── ArticleDetails/
│   │   │   │       │   ├── ArticleDetails.module.scss
│   │   │   │       │   └── ArticleDetails.tsx
│   │   │   │       ├── ArticleImageBlockComponent/
│   │   │   │       │   ├── ArticleImageBlockComponent.module.scss
│   │   │   │       │   └── ArticleImageBlockComponent.tsx
│   │   │   │       ├── ArticleList/
│   │   │   │       │   ├── ArticleList.module.scss
│   │   │   │       │   ├── ArticleList.stories.tsx
│   │   │   │       │   └── ArticleList.tsx
│   │   │   │       ├── ArticleListItem/
│   │   │   │       │   ├── ArticleListItem.module.scss
│   │   │   │       │   ├── ArticleListItem.stories.tsx
│   │   │   │       │   ├── ArticleListItem.test.tsx
│   │   │   │       │   ├── ArticleListItem.tsx
│   │   │   │       │   ├── ArticleListItemSkeleton.module.scss
│   │   │   │       │   └── ArticleListItemSkeleton.tsx
│   │   │   │       ├── ArticleTextBlockComponent/
│   │   │   │       │   ├── ArticleTextBlockComponent.module.scss
│   │   │   │       │   └── ArticleTextBlockComponent.tsx
│   │   │   │       └── ArticleViewSelector/
│   │   │   │           ├── ArticleViewSelector.module.scss
│   │   │   │           └── ArticleViewSelector.tsx
│   │   │   ├── Comment/
│   │   │   │   └── ui/
│   │   │   │       ├── CommentCard/
│   │   │   │       │   ├── CommentCard.stories.tsx
│   │   │   │       │   └── CommentCard.test.tsx
│   │   │   │       └── CommentList/
│   │   │   │           ├── CommentList.stories.tsx
│   │   │   │           └── CommentList.test.tsx
│   │   │   ├── Country/
│   │   │   │   ├── model/
│   │   │   │   │   └── types/
│   │   │   │   │       └── country.ts
│   │   │   │   └── ui/
│   │   │   │       └── CountrySelect/
│   │   │   │           └── CountrySelect.tsx
│   │   │   ├── Currency/
│   │   │   │   ├── model/
│   │   │   │   │   └── types/
│   │   │   │   │       └── currency.ts
│   │   │   │   └── ui/
│   │   │   │       └── CurrencySelect/
│   │   │   │           └── CurrencySelect.tsx
│   │   │   ├── Profile/
│   │   │   │   ├── model/
│   │   │   │   │   ├── selectors/
│   │   │   │   │   │   ├── getProfileData/
│   │   │   │   │   │   │   └── getProfileData.ts
│   │   │   │   │   │   ├── getProfileError/
│   │   │   │   │   │   │   └── getProfileError.ts
│   │   │   │   │   │   ├── getProfileForm/
│   │   │   │   │   │   │   └── getProfileForm.ts
│   │   │   │   │   │   ├── getProfileIsLoading/
│   │   │   │   │   │   │   └── getProfileIsLoading.ts
│   │   │   │   │   │   ├── getProfileReadonly/
│   │   │   │   │   │   │   └── getProfileReadonly.ts
│   │   │   │   │   │   └── getProfileValidateErrors/
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── fetchProfileData/
│   │   │   │   │   │   │   └── fetchProfileData.ts
│   │   │   │   │   │   ├── updateProfileData/
│   │   │   │   │   │   │   └── updateProfileData.ts
│   │   │   │   │   │   └── validateProfileData/
│   │   │   │   │   │       └── validateProfileData.ts
│   │   │   │   │   ├── slice/
│   │   │   │   │   │   ├── profileSlice.test.ts
│   │   │   │   │   │   └── profileSlice.ts
│   │   │   │   │   └── types/
│   │   │   │   │       └── profile.ts
│   │   │   │   └── ui/
│   │   │   │       └── ProfileCard/
│   │   │   │           ├── ProfileCard.module.scss
│   │   │   │           ├── ProfileCard.stories.tsx
│   │   │   │           ├── ProfileCard.test.tsx
│   │   │   │           └── ProfileCard.tsx
│   │   │   └── index.ts (для Article, Country, Currency, Profile)
│   │   ├── features/
│   │   │   ├── addCommentForm/
│   │   │   │   └── ui/
│   │   │   │       └── AddCommentForm/
│   │   │   │           ├── AddCommentForm.stories.tsx
│   │   │   │           └── AddCommentForm.tsx
│   │   │   ├── advisers/
│   │   │   │   ├── api/
│   │   │   │   │   └── advisersApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── AdviserFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── AdvisersPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── ArticleRating/
│   │   │   │   └── ui/
│   │   │   │       └── RatingCard/
│   │   │   │           ├── RatingCard.stories.tsx
│   │   │   │           └── RatingCard.tsx
│   │   │   ├── ArticleSortSelector/
│   │   │   │   └── ui/
│   │   │   │       └── ArticleSortSelector/
│   │   │   │           ├── ArticleSortSelector.stories.tsx
│   │   │   │           └── ArticleSortSelector.tsx
│   │   │   ├── ArticleTypeTabs/
│   │   │   │   └── ui/
│   │   │   │       └── ArticleTypeTabs/
│   │   │   │           ├── ArticleTypeTabs.stories.tsx
│   │   │   │           └── ArticleTypeTabs.tsx
│   │   │   ├── ArticleViewSelector/
│   │   │   │   └── ui/
│   │   │   │       └── ArticleViewSelector/
│   │   │   │           ├── ArticleViewSelector.stories.tsx
│   │   │   │           └── ArticleViewSelector.tsx
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   └── PersistLogin.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── LoginPage.tsx
│   │   │   │   ├── authApiSlice.ts
│   │   │   │   ├── authSlice.ts
│   │   │   │   └── index.ts
│   │   │   ├── AuthByUsername/
│   │   │   │   ├── model/
│   │   │   │   │   └── slice/
│   │   │   │   │       ├── loginSlice.test.ts
│   │   │   │   │       └── loginSlice.ts
│   │   │   │   └── ui/
│   │   │   │       └── LoginForm/
│   │   │   │           ├── LoginForm.stories.tsx
│   │   │   │           ├── LoginForm.test.tsx
│   │   │   │           └── LoginForm.tsx
│   │   │   ├── clients/
│   │   │   │   ├── api/
│   │   │   │   │   └── clientsApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── ClientFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── ClientsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── commissions/
│   │   │   │   ├── api/
│   │   │   │   │   └── commissionsApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── CommissionsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── api/
│   │   │   │   │   └── dashboardApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── DashboardStats.tsx
│   │   │   │   │   ├── DealsByStatusChart.tsx
│   │   │   │   │   ├── LiveActivityFeed.tsx
│   │   │   │   │   └── RecentDeals.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── DashboardPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── deals/
│   │   │   │   ├── api/
│   │   │   │   │   └── dealsApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── DealFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── DealsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── financials/
│   │   │   │   ├── api/
│   │   │   │   │   └── financialsApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── FinancialsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── mortgages/
│   │   │   │   ├── api/
│   │   │   │   │   └── mortgagesApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── MortgageFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── MortgagesPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── notifications/
│   │   │   │   ├── api/
│   │   │   │   │   └── notificationsApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── NotificationBell.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── permissions/
│   │   │   │   ├── api/
│   │   │   │   │   └── permissionsApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── PermissionsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── policies/
│   │   │   │   ├── api/
│   │   │   │   │   └── policiesApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── PolicyFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── PoliciesPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── processes/
│   │   │   │   ├── api/
│   │   │   │   │   └── processesApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── ProcessesPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── products/
│   │   │   │   ├── api/
│   │   │   │   │   └── productsApiSlice.ts
│   │   │   │   ├── components/
│   │   │   │   │   └── ProductFormModal.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── ProductsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── profile/
│   │   │   │   ├── api/
│   │   │   │   │   └── profileApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── ProfilePage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── reports/
│   │   │   │   ├── api/
│   │   │   │   │   └── reportsApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── ReportsPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── sales/
│   │   │   │   ├── api/
│   │   │   │   │   └── salesApiSlice.ts
│   │   │   │   ├── pages/
│   │   │   │   │   └── SalesPage.tsx
│   │   │   │   ├── types/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   └── settings/
│   │   │       ├── api/
│   │   │       │   └── settingsApiSlice.ts
│   │   │       ├── pages/
│   │   │       │   └── SettingsPage.tsx
│   │   │       ├── types/
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   ├── useApi.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useOnlineStatus.ts
│   │   │   ├── usePreloadComponents.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── usePWA.ts
│   │   │   ├── useTranslation.ts
│   │   │   └── useWebSocket.ts
│   │   ├── i18n/
│   │   │   ├── locales/
│   │   │   │   └── en.json
│   │   │   └── index.ts
│   │   ├── locales/
│   │   │   ├── bg.json
│   │   │   ├── en.json
│   │   │   ├── pl.json
│   │   │   ├── ro.json
│   │   │   ├── ru.json
│   │   │   ├── tr.json
│   │   │   └── uk.json
│   │   ├── pages/
│   │   │   ├── AboutPage/
│   │   │   │   └── ui/
│   │   │   │       ├── AboutPage.stories.tsx
│   │   │   │       ├── AboutPage.test.tsx
│   │   │   │       └── AboutPage.tsx
│   │   │   ├── ArticleDetailsPage/
│   │   │   │   └── ui/
│   │   │   │       ├── ArticleDetailsPage.async.tsx
│   │   │   │       ├── ArticleDetailsPage.stories.tsx
│   │   │   │       ├── ArticleDetailsPage.test.tsx
│   │   │   │       └── ArticleDetailsPage.tsx
│   │   │   ├── index.ts
│   │   │   ├── ArticlesPage/
│   │   │   │   ├── model/
│   │   │   │   │   ├── selectors/
│   │   │   │   │   │   └── articlesPageSelectors.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── fetchArticles/
│   │   │   │   │   │       └── fetchArticles.ts
│   │   │   │   │   ├── slice/
│   │   │   │   │   │   └── articlesPageSlice.ts
│   │   │   │   │   └── types/
│   │   │   │   │       └── articlesPageSchema.ts
│   │   │   │   └── ui/
│   │   │   │       ├── ArticlesPage.async.tsx
│   │   │   │       ├── ArticlesPage.stories.tsx
│   │   │   │       ├── ArticlesPage.test.tsx
│   │   │   │       └── ArticlesPage.tsx
│   │   │   ├── index.ts
│   │   │   ├── MainPage/
│   │   │   │   └── ui/
│   │   │   │       ├── MainPage.stories.tsx
│   │   │   │       ├── MainPage.test.tsx
│   │   │   │       └── MainPage.tsx
│   │   │   ├── NotFoundPage/
│   │   │   │   └── ui/
│   │   │   │       ├── NotFoundPage.stories.tsx
│   │   │   │       ├── NotFoundPage.test.tsx
│   │   │   │       └── NotFoundPage.tsx
│   │   │   ├── ProfilePage/
│   │   │   │   └── ui/
│   │   │   │       ├── ProfilePage.async.tsx
│   │   │   │       ├── ProfilePage.stories.tsx
│   │   │   │       ├── ProfilePage.test.tsx
│   │   │   │       ├── ProfilePage.tsx
│   │   │   │       └── ProfilePageHeader/
│   │   │   │           ├── ProfilePageHeader.module.scss
│   │   │   │           └── ProfilePageHeader.tsx
│   │   │   └── index.ts
│   │   ├── ApplicationsPage.jsx
│   │   ├── Clients.tsx
│   │   ├── Commissions.tsx
│   │   ├── Consultants.tsx
│   │   ├── CorporateStyleDemo.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DashboardPage.jsx
│   │   ├── Deals.tsx
│   │   ├── Financials.tsx
│   │   ├── index.tsx
│   │   ├── Insurances.tsx
│   │   ├── Login.tsx
│   │   ├── MLAnalytics.tsx
│   │   ├── Mortgages.tsx
│   │   ├── Permissions.tsx
│   │   ├── Policies.tsx
│   │   ├── Processes.tsx
│   │   ├── Products.tsx
│   │   ├── Reports.tsx
│   │   ├── Sales.tsx
│   │   ├── Settings.tsx
│   │   └── UIComponentsDemo.tsx
│   │   ├── services/
│   │   │   ├── analytics.ts
│   │   │   ├── api.ts
│   │   │   └── i18n.ts
│   │   ├── shared/
│   │   │   ├── assets/
│   │   │   │   └── icons/
│   │   │   │       ├── article-20-20.svg
│   │   │   │       ├── calendar-20-20.svg
│   │   │   │       ├── eye-20-20.svg
│   │   │   │       ├── list-24-24.svg
│   │   │   │       └── tiled-24-24.svg
│   │   │   ├── config/
│   │   │   │   └── storybook/
│   │   │   │       ├── RouterDecorator/
│   │   │   │       │   └── RouterDecorator.tsx
│   │   │   │       ├── StoreDecorator/
│   │   │   │       │   └── StoreDecorator.tsx
│   │   │   │       ├── StyleDecorator/
│   │   │   │       │   └── StyleDecorator.tsx
│   │   │   │       └── ThemeDecorator/
│   │   │   │           └── ThemeDecorator.tsx
│   │   │   ├── const/
│   │   │   │   └── router.ts
│   │   │   ├── lib/
│   │   │   │   └── tests/
│   │   │   │       └── componentRender/
│   │   │   │           └── componentRender.tsx
│   │   │   └── types/
│   │   │       └── router.ts
│   │   │   └── ui/
│   │   │       ├── AppLink/
│   │   │       │   ├── AppLink.stories.tsx
│   │   │       │   └── AppLink.tsx
│   │   │       ├── Avatar/
│   │   │       │   ├── Avatar.stories.tsx
│   │   │       │   ├── Avatar.test.tsx
│   │   │       │   └── Avatar.tsx
│   │   │       ├── Button/
│   │   │       │   ├── Button.stories.tsx
│   │   │       │   └── Button.tsx
│   │   │       ├── Icon/
│   │   │       │   ├── Icon.test.tsx
│   │   │       │   └── Icon.tsx
│   │   │       ├── Input/
│   │   │       │   ├── Input.stories.tsx
│   │   │       │   ├── Input.test.tsx
│   │   │       │   └── Input.tsx
│   │   │       ├── LangSwitcher/
│   │   │       │   └── LangSwitcher.tsx
│   │   │       ├── Loader/
│   │   │       │   ├── Loader.stories.tsx
│   │   │       │   └── Loader.tsx
│   │   │       ├── Modal/
│   │   │       │   ├── Modal.stories.tsx
│   │   │       │   ├── Modal.test.tsx
│   │   │       │   └── Modal.tsx
│   │   │       ├── Select/
│   │   │       │   ├── Select.module.scss
│   │   │       │   ├── Select.stories.tsx
│   │   │       │   ├── Select.test.tsx
│   │   │       │   └── Select.tsx
│   │   │       └── Text/
│   │   │           ├── Text.stories.tsx
│   │   │           ├── Text.test.tsx
│   │   │           └── Text.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── advisorSlice.ts
│   │   │   │   └── clientsSlice.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── dataSlice.ts
│   │   │   ├── index.ts
│   │   │   ├── store.ts
│   │   │   └── uiSlice.ts
│   │   ├── styles/
│   │   │   ├── advanced-ui-components.css
│   │   │   ├── App.css
│   │   │   ├── corporate-design-system.css
│   │   │   ├── corporate-theme.css
│   │   │   ├── custom.css
│   │   │   ├── enterprise-dashboard-clean.css
│   │   │   ├── enterprise-dashboard.css
│   │   │   ├── global-design-system.css
│   │   │   ├── globals.css
│   │   │   ├── index.css
│   │   │   ├── permissions.css
│   │   │   ├── sidebar-layout.css
│   │   │   └── universal-layout.css
│   │   ├── types/
│   │   │   ├── advisor.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── deal.ts
│   │   │   ├── index.ts
│   │   │   └── ui.ts
│   │   ├── utils/
│   │   │   ├── auth.ts
│   │   │   ├── cn.ts
│   │   │   └── styling.ts
│   │   └── widgets/
│   │       ├── LangSwitcher/
│   │       │   └── ui/
│   │       │       ├── LangSwitcher.stories.tsx
│   │       │       ├── LangSwitcher.test.tsx
│   │       │       └── LangSwitcher.tsx
│   │       ├── Navbar/
│   │       │   └── ui/
│   │       │       ├── Navbar.stories.tsx
│   │       │       ├── Navbar.test.tsx
│   │       │       └── Navbar.tsx
│   │       ├── PageLoader/
│   │       │   └── ui/
│   │       │       ├── PageLoader.test.tsx
│   │       │       └── PageLoader.tsx
│   │       ├── Sidebar/
│   │       │   ├── model/
│   │       │   │   └── selectors/
│   │       │   │       └── getSidebarItems.ts
│   │       │   └── ui/
│   │       │       ├── Sidebar/
│   │       │       │   ├── Sidebar.stories.tsx
│   │       │       │   ├── Sidebar.test.tsx
│   │       │       │   └── Sidebar.tsx
│   │       │       └── SidebarItem/
│   │       │           ├── SidebarItem.module.scss
│   │       │           └── SidebarItem.tsx
│   │       └── ThemeSwitcher/
│   │           └── ui/
│   │               ├── ThemeSwitcher.stories.tsx
│   │               └── ThemeSwitcher.tsx
│   ├── App.jsx
│   ├── App.tsx
│   ├── index.tsx
│   ├── main.tsx
│   └── serviceWorkerRegistration.ts
└── templates/
    ├── Шаблоны на стороне сервера (возможно, для SSR или статической генерации).
    ├── base.html
    └── pages/
        └── deal_list.html