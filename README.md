# The `@wordpress/dataviews` package

The DataViews package offers two components to work with a given dataset:

- `DataViews`: allows rendering a dataset using different types of layouts (table, grid, list) and interaction capabilities (search, filters, sorting, etc.).
- `DataForm`: allows editing the items from the same dataset.

## Installation

Install the module

```bash
npm install @wordpress/dataviews --save
```

## `DataViews`

### Usage

The component is data agnostic, it just requires the data to be an array of objects with an unique identifier — it can work with data coming from a static (e.g.: JSON file) or dynamic source (e.g.: HTTP Request). Consumers are responsible to query the data source appropiately:

![DataViews flow](https://developer.wordpress.org/files/2024/09/368600071-20aa078f-7c3d-406d-8dd0-8b764addd22a.png "DataViews flow")

```jsx
const Example = () => {
	// Declare data, fields, etc.

	return (
		<DataViews
			data={ data }
			fields={ fields }
			view={ view }
			onChangeView={ onChangeView }
			defaultLayouts={ defaultLayouts }
			actions={ actions }
			paginationInfo={ paginationInfo }
		/>
	);
};
```

<div class="callout callout-info">At <a href="https://wordpress.github.io/gutenberg/">WordPress Gutenberg's Storybook</a> there's and <a href="https://wordpress.github.io/gutenberg/?path=/docs/dataviews-dataviews--docs">example implementation of the Dataviews component</a>.</div>

### Properties

#### `data`: `Object[]`

The dataset to work with, represented as a one-dimensional array.

Example:

```js
const data = [
	{
		id: 1,
		title: 'Title',
		author: 'Admin',
		date: '2012-04-23T18:25:43.511Z',
	},
	{
		/* ... */
	},
];
```

By default, dataviews would use each record's `id` as an unique identifier. If the records don't have a `id` property that identify them uniquely, they consumer needs to provide a `getItemId` function that returns an unique identifier for the record.

#### `fields`: `Object[]`

The fields describe the visible items for each record in the dataset and how they behave (how to sort them, display them, etc.). See "Fields API" as a reference for every property.

Example:

```js
const STATUSES = [
	{ value: 'draft', label: __( 'Draft' ) },
	{ value: 'future', label: __( 'Scheduled' ) },
	{ value: 'pending', label: __( 'Pending Review' ) },
	{ value: 'private', label: __( 'Private' ) },
	{ value: 'publish', label: __( 'Published' ) },
	{ value: 'trash', label: __( 'Trash' ) },
];
const fields = [
	{
		id: 'title',
		label: 'Title',
		enableHiding: false,
	},
	{
		id: 'date',
		label: 'Date',
		render: ( { item } ) => {
			return <time>{ getFormattedDate( item.date ) }</time>;
		},
	},
	{
		id: 'author',
		label: 'Author',
		render: ( { item } ) => {
			return <a href="...">{ item.author }</a>;
		},
		elements: [
			{ value: 1, label: 'Admin' },
			{ value: 2, label: 'User' },
		],
		filterBy: {
			operators: [ 'is', 'isNot' ],
		},
		enableSorting: false,
	},
	{
		id: 'status',
		label: 'Status',
		getValue: ( { item } ) =>
			STATUSES.find( ( { value } ) => value === item.status )?.label ??
			item.status,
		elements: STATUSES,
		filterBy: {
			operators: [ 'isAny' ],
		},
		enableSorting: false,
	},
];
```

#### `view`: `Object`

The view object configures how the dataset is visible to the user.

Example:

```js
const view = {
	type: 'table',
	search: '',
	filters: [
		{ field: 'author', operator: 'is', value: 2 },
		{ field: 'status', operator: 'isAny', value: [ 'publish', 'draft' ] },
	],
	page: 1,
	perPage: 5,
	sort: {
		field: 'date',
		direction: 'desc',
	},
	fields: [ 'author', 'status' ],
	layout: {},
};
```

Properties:

-   `type`: view type, one of `table`, `grid`, `list`. See "Layout types".
-   `search`: the text search applied to the dataset.
-   `filters`: the filters applied to the dataset. Each item describes:
    -   `field`: which field this filter is bound to.
    -   `operator`: which type of filter it is. See "Operator types".
    -   `value`: the actual value selected by the user.
-   `perPage`: number of records to show per page.
-   `page`: the page that is visible.
-   `sort`:

    -   `field`: the field used for sorting the dataset.
    -   `direction`: the direction to use for sorting, one of `asc` or `desc`.

-   `fields`: a list of field `id` that are visible in the UI and the specific order in which they are displayed.
-   `layout`: config that is specific to a particular layout type.

##### Properties of `layout`

| Properties of `layout`                                                                                          | Table | Grid | List |
| --------------------------------------------------------------------------------------------------------------- | ----- | ---- | ---- |
| `primaryField`: the field's `id` to be highlighted in each layout. It's not hidable.                            | ✓     | ✓    | ✓    |
| `mediaField`: the field's `id` to be used for rendering each card's media. It's not hiddable.                   |       | ✓    | ✓    |
| `columnFields`: a list of field's `id` to render vertically stacked instead of horizontally (the default).      |       | ✓    |      |
| `badgeFields`: a list of field's `id` to render without label and styled as badges.                             |       | ✓    |      |
| `combinedFields`: a list of "virtual" fields that are made by combining others. See "Combining fields" section. | ✓     |      |      |
| `styles`: additional `width`, `maxWidth`, `minWidth` styles for each field column.                              | ✓     |      |      |

##### Combining fields

The `table` layout has the ability to create "virtual" fields that are made out by combining existing ones.

Each "virtual field", has to provide an `id` and `label` (optionally a `header` instead), which have the same meaning as any other field.

Additionally, they need to provide:

-   `children`: a list of field's `id` to combine
-   `direction`: how should they be stacked, `vertical` or `horizontal`

For example, this is how you'd define a `site` field which is a combination of a `title` and `description` fields, which are not displayed:

```js
{
	fields: [ 'site', 'status' ],
	layout: {
		combinedFields: [
			{
				id: 'site',
				label: 'Site',
				children: [ 'title', 'description' ],
				direction: 'vertical',
			}
		]
	}
}
```

#### `onChangeView`: `function`

Callback executed when the view has changed. It receives the new view object as a parameter.

The view is a representation of the visible state of the dataset: what type of layout is used to display it (table, grid, etc.), how the dataset is filtered, how it is sorted or paginated. It's the consumer's responsibility to use the view config to query the data provider and make sure the user decisions (sort, pagination, filters, etc.) are respected.

The following example shows how a view object is used to query the WordPress REST API via the entities abstraction. The same can be done with any other data provider.

```js
function MyCustomPageTable() {
	const [ view, setView ] = useState( {
		type: 'table',
		perPage: 5,
		page: 1,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		search: '',
		filters: [
			{ field: 'author', operator: 'is', value: 2 },
			{
				field: 'status',
				operator: 'isAny',
				value: [ 'publish', 'draft' ],
			},
		],
		fields: [ 'author', 'status' ],
		layout: {},
	} );

	const queryArgs = useMemo( () => {
		const filters = {};
		view.filters.forEach( ( filter ) => {
			if ( filter.field === 'status' && filter.operator === 'isAny' ) {
				filters.status = filter.value;
			}
			if ( filter.field === 'author' && filter.operator === 'is' ) {
				filters.author = filter.value;
			}
		} );
		return {
			per_page: view.perPage,
			page: view.page,
			_embed: 'author',
			order: view.sort?.direction,
			orderby: view.sort?.field,
			search: view.search,
			...filters,
		};
	}, [ view ] );

	const { records } = useEntityRecords( 'postType', 'page', queryArgs );

	return (
		<DataViews
			data={ records }
			view={ view }
			onChangeView={ setView }
			// ...
		/>
	);
}
```

#### `actions`: `Object[]`

Collection of operations that can be performed upon each record.

Each action is an object with the following properties:

-   `id`: string, required. Unique identifier of the action. For example, `move-to-trash`.
-   `label`: string|function, required. User facing description of the action. For example, `Move to Trash`. It can also take a function that takes the selected items as a parameter and returns a string: this can be useful to provide a dynamic label based on the selection.
-   `isPrimary`: boolean, optional. Whether the action should be listed inline (primary) or in hidden in the more actions menu (secondary).
-   `icon`: SVG element. Icon to show for primary actions. It's required for a primary action, otherwise the action would be considered secondary.
-   `isEligible`: function, optional. Whether the action can be performed for a given record. If not present, the action is considered to be eligible for all items. It takes the given record as input.
-   `isDestructive`: boolean, optional. Whether the action can delete data, in which case the UI would communicate it via red color.
-   `supportsBulk`: Whether the action can be used as a bulk action. False by default.
-   `disabled`: Whether the action is disabled. False by default.
-   `context`: where this action would be visible. One of `list`, `single`.
-   `callback`: function, required unless `RenderModal` is provided. Callback function that takes as input the list of items to operate with, and performs the required action.
-   `RenderModal`: ReactElement, optional. If an action requires that some UI be rendered in a modal, it can provide a component which takes as input the the list of `items` to operate with, `closeModal` function, and `onActionPerformed` function. When this prop is provided, the `callback` property is ignored.
-   `hideModalHeader`: boolean, optional. This property is used in combination with `RenderModal` and controls the visibility of the modal's header. If the action renders a modal and doesn't hide the header, the action's label is going to be used in the modal's header.
-   `modalHeader`: string, optional. The header of the modal.

#### `paginationInfo`: `Object`

-   `totalItems`: the total number of items in the datasets.
-   `totalPages`: the total number of pages, taking into account the total items in the dataset and the number of items per page provided by the user.

#### `search`: `boolean`

Whether the search input is enabled. `true` by default.

#### `searchLabel`: `string`

What text to show in the search input. "Search" by default.

#### `getItemId`: `function`

Function that receives an item and returns an unique identifier for it.

By default, dataviews would use each record's `id` as an unique identifier. If the records don't have a `id` property that identify them uniquely, they consumer needs to provide a `getItemId` function that returns an unique identifier for the record.

#### `isLoading`: `boolean`

Whether the data is loading. `false` by default.

#### `defaultLayouts`: `Record< string, view >`

This property provides layout information about the view types that are active. If empty, enables all layout types (see "Layout Types") with empty layout data.

For example, this is how you'd enable only the table view type:

```js
const defaultLayouts = {
	table: {
		layout: {
			primaryField: 'my-key',
		},
	},
};
```

The `defaultLayouts` property should be an object that includes properties named `table`, `grid`, or `list`. Each of these properties should contain a `layout` property, which holds the configuration for each specific layout type. Check "Properties of layout" for the full list of properties available for each layout's configuration

#### `selection`: `string[]`

The list of selected items' ids.

If `selection` and `onChangeSelection` are provided, the `DataViews` component behaves as a controlled component, otherwise, it behaves like an uncontrolled component.

#### `onChangeSelection`: `function`

Callback that signals the user selected one of more items. It receives the list of selected items' ids as a parameter.

If `selection` and `onChangeSelection` are provided, the `DataViews` component behaves as a controlled component, otherwise, it behaves like an uncontrolled component.

#### `header`: React component

React component to be rendered next to the view config button.

## `DataForm`

### Usage

```jsx
const Example = () => {
	// Declare data, fields, etc.

	return (
		<DataForm
			data={ data }
			fields={ fields }
			form={ form }
			onChange={ onChange }
		/>
	)
}
```

<div class="callout callout-info">At <a href="https://wordpress.github.io/gutenberg/">WordPress Gutenberg's Storybook</a> there's and <a href="https://wordpress.github.io/gutenberg/?path=/docs/dataviews-dataform--docs">example implementation of the DataForm component</a>.</div>

### Properties

#### `data`: `Object`

A single item to be edited.

This could be thought as as a single record coming from the `data` property of `DataViews` — though it doesn't need to be; it can be, for example, a mix of records if you support bulk editing.

#### `fields`: `Object[]`

The fields describe which parts of the the data are visible and how they behave (how to edit them, validating them, etc.). See "Fields API" as a reference for every property.

Example:

```js
const fields = [
	{
		id: 'title',
		type: 'text',
		label: 'Title',
	},
	{
		id: 'date',
		type: 'datetime',
		label: 'Date',
	},
	{
		id: 'author',
		type: 'text'
		label: 'Author',
		elements: [
			{ value: 1, label: 'Admin' },
			{ value: 2, label: 'User' },
		],
	},
];
```

#### `form`: `Object[]`

- `type`: either `regular` or `panel`.
- `fields`: a list of fields ids that should be rendered.

#### `onChange`: `function`

Callback function that receives an object with the edits done by the user.

Example:

```js
const data = {
	id: 1,
	title: 'Title',
	author: 'Admin',
	date: '2012-04-23T18:25:43.511Z',
};

const onChange = ( edits ) => {
	/*
	 * edits will contain user edits.
	 * For example, if the user edited the title
	 * edits will be:
	 *
	 * {
	 *   title: 'New title'
	 * }
	 *
	 */
};

return (
	<DataForm
		data={data}
		fields={fields}
		form={form}
		onChange={onChange}
	/>
);
```

## Utilities

### `filterSortAndPaginate`

Utility to apply the view config (filters, search, sorting, and pagination) to a dataset client-side.

Parameters:

- `data`: the dataset, as described in the "data" property of DataViews.
- `view`: the view config, as described in the "view" property of DataViews.
- `fields`: the fields config, as described in the "fields" property of DataViews.

Returns an object containing:

- `data`: the new dataset, with the view config applied.
- `paginationInfo`: object containing the following properties:
	- `totalItems`: total number of items for the current view config.
	- `totalPages`: total number of pages for the current view config.

### `isItemValid`

Utility to determine whether or not the given item's value is valid according to the current fields and form config.

Parameters:

- `item`: the item, as described in the "data" property of DataForm.
- `fields`: the fields config, as described in the "fields" property of DataForm.
- `form`: the form config, as described in the "form" property of DataForm.

Returns a boolean indicating if the item is valid (true) or not (false).

## Fields API

### `id`

The unique identifier of the field.

- Type: `string`.
- Required.

Example:

```js
{ id: 'field_id' }
```

### `type`

Field type. One of `text`, `integer`, `datetime`.

If a field declares a `type`, it gets default implementations for the `sort`, `isValid`, and `Edit` functions. They will overriden if the field provides its own.

- Type: `string`.
- Optional.

Example:

```js
{ type: 'text' }
```

### `label`

The field's name. This will be used across the UI.

- Type: `string`.
- Optional.
- Defaults to the `id` value.

Example:

```js
{ label: 'Title' }
```

### `header`

React component used by the layouts to display the field name — useful to add icons, etc. It's complementary to the `label` property.

- Type: React component.
- Optional.
- Defaults to the `label` value.
- Props: none.
- Returns a React element that represents the field's name.

Example:

```js
{
	header: () => { /* Returns a react element. */ }
}
```

### `getValue`

React component that returns the value of a field. This value is used in sorting the fields, or when filtering.

- Type: React component.
- Optional.
- Defaults to `item[ id ]`.
- Props:
  - `item` value to be processed.
- Returns a value that represents the field.

Example:

```js
{
	getValue: ( { item } ) => { /* The field's value.  */ };
}
```

### `render`

React component that renders the field. This is used by the layouts.

- Type: React component.
- Optional.
- Defaults to `getValue`.
- Props
  - `item` value to be processed.
- Returns a React element that represents the field's value.

Example:

```js
{
	render: ( { item} ) => { /* React element to be displayed. */ }
}
```

### `Edit`

React component that renders the control to edit the field.

- Type: React component | `string`. If it's a string, it needs to be one of `text`, `integer`, `datetime`, `radio`, `select`.
- Required by DataForm. Optional if the field provided a `type`.
- Props:
  - `data`: the item to be processed
  - `field`: the field definition
  - `onChange`: the callback with the updates
  - `hideLabelFromVision`: boolean representing if the label should be hidden
- Returns a React element to edit the field's value.

Example: 

```js
// A custom control defined by the field.
{
	Edit: ( {
		data,
		field,
		onChange,
		hideLabelFromVision
	} ) => {
		const value = field.getValue( { item: data } );

		return (
			<CustomTimePicker
				value={ value }
				onChange={ onChange }
				hideLabelFromVision
			/>
		);
	}
}

// Use one of the core controls.
{
	Edit: 'radio'
}

// Edit is optional when field's type is present.
// The field will use the default Edit function for text.
{
	type: 'text'
}

// Edit can be provided even if field's type is present.
// The field will use its own custom control.
{
	type: 'text',
	Edit: 'radio'
}
```

### `sort`

Function to sort the records.

- Type: `function`.
- Optional.
- Args
  - `a`: the first item to compare
  - `b`: the second item to compare
  - `direction`: either `asc` (ascending) or `desc` (descending)
- Returns a number where:
  - a negative value indicates that `a` should come before `b`
  - a positive value indicates that `a` should come after `b`
  - 0 indicates that `a` and `b` are considered equal

Example:

```js
// A custom sort function defined by the field.
{
	sort: ( a, b, direction ) => {
		return direction === 'asc'
			? a.localeCompare( b )
			: b.localeCompare( a );
	}
}
```

```js
// If field type is provided,
// the field gets a default sort function.
{
	type: 'number'
}
```

```js
// Even if a field type is provided,
// fields can override the default sort function assigned for that type.
{
	type: 'number'
	sort: ( a, b, direction ) => { /* Custom sort */ }
}
```

### `isValid`

Function to validate a field's value.

- Type: function.
- Optional.
- Args
  - `item`: the data to validate
  - `context`: an object containing the following props:
    - `elements`: the elements defined by the field
- Returns a boolean, indicating if the field is valid or not.

Example:

```js
// Custom isValid function.
{
	isValid: ( item, context ) => {
		return !! item;
	}
}
```

```js
// If the field defines a type,
// it'll get a default isValid function for the type.
{
	type: 'number',
}
```

```js
// Even if the field provides a type,
// the field can override the default isValid function.
{
	type: 'number',
	isValid: ( item, context ) => { /* Custom function. */ }
}
```

### `isVisible`

Function that indicates if the field should be visible.

- Type: `function`.
- Optional.
- Args
  - `item`: the data to be processed
- Returns a `boolean` indicating if the field should be visible (`true`) or not (`false`).

Example:

```js
// Custom isVisible function.
{
	isVisible: ( item ) => { /* Custom implementation. */ }
}
```

### `enableSorting`

Boolean indicating if the field is sortable.

- Type: `boolean`.
- Optional.
- Defaults to `true`.

Example:

```js
{ enableSorting: true }
```

### `enableHiding`

Boolean indicating if the field can be hidden.

- Type: `boolean`.
- Optional.
- Defaults to `true`.

Example:

```js
{ enableHiding: true }
```

### `enableGlobalSearch`

Boolean indicating if the field is searchable.

- Type: `boolean`.
- Optional.
- Defaults to `false`.

Example:

```js
{ enableGlobalSearch: true }
```

### `elements`

List of valid values for a field. If provided, it creates a DataViews' filter for the field. DataForm's edit control will use these values as well (see `Edit` field property).

- Type: `array` of objects.
- Optional.
- Each object can have the following properties:
  - `value`: required, the value to match against the field's value.
  - `label`: required, the name to display to users.
  - `description`: optional, a longer description of the item.

Example:

```js
{
	elements: [
		{ value: '1', label: 'Product A' },
		{ value: '2', label: 'Product B' },
		{ value: '3', label: 'Product C' },
		{ value: '4', label: 'Product D' },
	]
}
```

### `filterBy`

Configuration of the filters.

- Type: `object`.
- Optional.
- Properties:
  - `operators`: the list of operators supported by the field. See "operators" below. By default, a filter will support the `isAny` and `isNone` multi-selection operators.
  - `isPrimary`: boolean, optional. Indicates if the filter is primary. A primary filter is always visible and is not listed in the "Add filter" component, except for the list layout where it behaves like a secondary filter.

Operators:

| Operator   | Selection      | Description                                                             | Example                                            |
| ---------- | -------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| `is`       | Single item    | `EQUAL TO`. The item's field is equal to a single value.                | Author is Admin                                    |
| `isNot`    | Single item    | `NOT EQUAL TO`. The item's field is not equal to a single value.        | Author is not Admin                                |
| `isAny`    | Multiple items | `OR`. The item's field is present in a list of values.                  | Author is any: Admin, Editor                       |
| `isNone`   | Multiple items | `NOT OR`. The item's field is not present in a list of values.          | Author is none: Admin, Editor                      |
| `isAll`    | Multiple items | `AND`. The item's field has all of the values in the list.              | Category is all: Book, Review, Science Fiction     |
| `isNotAll` | Multiple items | `NOT AND`. The item's field doesn't have all of the values in the list. | Category is not all: Book, Review, Science Fiction |

`is` and `isNot` are single-selection operators, while `isAny`, `isNone`, `isAll`, and `isNotALl` are multi-selection. By default, a filter with no operators declared will support the `isAny` and `isNone` multi-selection operators. A filter cannot mix single-selection & multi-selection operators; if a single-selection operator is present in the list of valid operators, the multi-selection ones will be discarded and the filter won't allow selecting more than one item.

Example:

```js
// Set a filter as primary.
{
	filterBy: {
		isPrimary: true
	}
}
```

```js
// Configure a filter as single-selection.
{
	filterBy: {
		operators: [ `is`, `isNot` ]
	}
}
```

```js
// Configure a filter as multi-selection with all the options.
{
	filterBy: {
		operators: [ `isAny`, `isNone`, `isAll`, `isNotAll` ]
	}
}
```

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [WordPress](https://make.wordpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/WordPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
