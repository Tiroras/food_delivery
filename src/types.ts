export interface Couriers {
  courier_id: number
  name: string
  phone: string
  vehicle: string
  hired_at: Date
}

/**
 * Exposes the same fields as Couriers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CouriersWithDefaults {
  courier_id?: number
  name: string
  phone: string
  vehicle: string
  hired_at: Date
}
/**
 * Exposes all fields present in customers as a typescript
 * interface.
 */
export interface Customers {
  customer_id: number
  email: string
  name: string
  phone: string
  address: string
  /**  Defaults to: CURRENT_TIMESTAMP. */
  registered_at: Date
}

/**
 * Exposes the same fields as Customers,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface CustomersWithDefaults {
  customer_id?: number
  email: string
  name: string
  phone: string
  address: string
  /**  Defaults to: CURRENT_TIMESTAMP. */
  registered_at?: Date
}
/**
 * Exposes all fields present in menu_categories as a typescript
 * interface.
 */
export interface MenuCategories {
  category_id: number
  restaurant_id: number
  name: string
}

/**
 * Exposes the same fields as MenuCategories,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface MenuCategoriesWithDefaults {
  category_id?: number
  restaurant_id: number
  name: string
}
/**
 * Exposes all fields present in menu_item_categories as a typescript
 * interface.
 */
export interface MenuItemCategories {
  item_id: number
  category_id: number
}

/**
 * Exposes the same fields as MenuItemCategories,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface MenuItemCategoriesWithDefaults {
  item_id: number
  category_id: number
}
/**
 * Exposes all fields present in menu_items as a typescript
 * interface.
 */
export interface MenuItems {
  item_id: number
  restaurant_id: number
  name: string
  price: number
  /**  Defaults to: 1. */
  available: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  updated_at?: Date | null
}

/**
 * Exposes the same fields as MenuItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface MenuItemsWithDefaults {
  item_id?: number
  restaurant_id: number
  name: string
  price: number
  /**  Defaults to: 1. */
  available?: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  updated_at?: Date | null
}
/**
 * Exposes all fields present in order_items as a typescript
 * interface.
 */
export interface OrderItems {
  order_item_id: number
  order_id: number
  item_id: number
  /**  Defaults to: 1. */
  quantity: number
  price_each: number
}

/**
 * Exposes the same fields as OrderItems,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface OrderItemsWithDefaults {
  order_item_id?: number
  order_id: number
  item_id: number
  /**  Defaults to: 1. */
  quantity?: number
  price_each: number
}
/**
 * Exposes all fields present in orders as a typescript
 * interface.
 */
export interface Orders {
  order_id: number
  customer_id: number
  courier_id?: number | null
  restaurant_id: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  order_date: Date
  /**  Defaults to: New. */
  status: 'New' | 'Preparing' | 'OnWay' | 'Delivered' | 'Canceled'
  /**  Defaults to: 0.00. */
  total_amount: number
  delivered_at?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP. */
  updated_at?: Date | null
}

/**
 * Exposes the same fields as Orders,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface OrdersWithDefaults {
  order_id?: number
  customer_id: number
  courier_id?: number | null
  restaurant_id: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  order_date?: Date
  /**  Defaults to: New. */
  status?: 'New' | 'Preparing' | 'OnWay' | 'Delivered' | 'Canceled'
  /**  Defaults to: 0.00. */
  total_amount?: number
  delivered_at?: Date | null
  /**  Defaults to: CURRENT_TIMESTAMP. */
  updated_at?: Date | null
}
/**
 * Exposes all fields present in restaurants as a typescript
 * interface.
 */
export interface Restaurants {
  restaurant_id: number
  name: string
  address: string
  phone: string
}

/**
 * Exposes the same fields as Restaurants,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface RestaurantsWithDefaults {
  restaurant_id?: number
  name: string
  address: string
  phone: string
}
/**
 * Exposes all fields present in reviews as a typescript
 * interface.
 */
export interface Reviews {
  review_id: number
  customer_id: number
  restaurant_id?: number | null
  courier_id?: number | null
  rating: number
  comment?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP. */
  created_at: Date
}

/**
 * Exposes the same fields as Reviews,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface ReviewsWithDefaults {
  review_id?: number
  customer_id: number
  restaurant_id?: number | null
  courier_id?: number | null
  rating: number
  comment?: string | null
  /**  Defaults to: CURRENT_TIMESTAMP. */
  created_at?: Date
}
/**
 * Exposes all fields present in v_available_menu as a typescript
 * interface.
 */
export interface VAvailableMenu {
  /**  Defaults to: 0. */
  item_id: number
  restaurant_id: number
  name: string
  price: number
}

/**
 * Exposes the same fields as VAvailableMenu,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface VAvailableMenuWithDefaults {
  /**  Defaults to: 0. */
  item_id?: number
  restaurant_id: number
  name: string
  price: number
}
/**
 * Exposes all fields present in v_order_details as a typescript
 * interface.
 */
export interface VOrderDetails {
  /**  Defaults to: 0. */
  order_id: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  order_date: Date
  /**  Defaults to: New. */
  status: 'New' | 'Preparing' | 'OnWay' | 'Delivered' | 'Canceled'
  customer_name: string
  restaurant_name: string
  courier_name?: string | null
  item_id: number
  item_name: string
  /**  Defaults to: 1. */
  quantity: number
  price_each: number
}

/**
 * Exposes the same fields as VOrderDetails,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface VOrderDetailsWithDefaults {
  /**  Defaults to: 0. */
  order_id?: number
  /**  Defaults to: CURRENT_TIMESTAMP. */
  order_date?: Date
  /**  Defaults to: New. */
  status?: 'New' | 'Preparing' | 'OnWay' | 'Delivered' | 'Canceled'
  customer_name: string
  restaurant_name: string
  courier_name?: string | null
  item_id: number
  item_name: string
  /**  Defaults to: 1. */
  quantity?: number
  price_each: number
}
/**
 * Exposes all fields present in v_restaurant_sales as a typescript
 * interface.
 */
export interface VRestaurantSales {
  /**  Defaults to: 0. */
  restaurant_id: number
  name: string
  /**  Defaults to: 0. */
  orders_count: number
  total_sales?: number | null
}

/**
 * Exposes the same fields as VRestaurantSales,
 * but makes every field containing a DEFAULT value optional.
 *
 * This is especially useful when generating inserts, as you
 * should be able to omit these fields if you'd like
 */
export interface VRestaurantSalesWithDefaults {
  /**  Defaults to: 0. */
  restaurant_id?: number
  name: string
  /**  Defaults to: 0. */
  orders_count?: number
  total_sales?: number | null
}