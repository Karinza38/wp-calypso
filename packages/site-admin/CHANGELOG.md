## 0.0.1

Initial release of the site-admin package providing a framework for building modern WordPress admin interfaces.

### Components

- `SidebarButton`: Base button component for sidebar interactions
- `SidebarContent`: Main sidebar layout component with navigation context
- `SidebarNavigationItem`: Interactive navigation items with icon support
- `SidebarNavigationScreen`: Screen container for sidebar navigation
- `SiteIcon`: Site icon display component

### Routing System

- `RoutesContext`: Context provider for current matched route
- `ConfigContext`: Context for router configuration and settings
- `browserHistory`: Browser history instance for navigation state

#### Router Hooks

- `useHistory`: Hook for navigation and history management
- `useLink`: Hook for handling link navigation
- `useLocation`: Hook for accessing current route location
- `useMatch`: Hook for route matching functionality

## 0.1.0

- Add `history` package dependency
- Set `SiteNavigationItem`’s `as` prop automatically based on to or onClick.

### Components

- `SiteHub`: Site navigation and context switcher
- `Link`: Router component providing declarative navigation

## 0.1.1

### Components

- `NavigableRegion`: Accessible region component with keyboard navigation support
- Expose the `SiteHub` component publicly

## 0.1.2

### Components

- `Page`: component wrapper for the page content.

## 0.1.3

- Expose `<Page />` component

## Next
