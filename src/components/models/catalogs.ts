type Thumbnail = {
    type: string;
    height: number;
    width: number;
    url: string;
  };
  
  type Photo = {
    url: string;
    thumbnails: Thumbnail[];
  };
  
  type Catalog = {
    id: number;
    title: string;
    code: string;
    size_group_id: number;
    size_group_ids: number[];
    multiple_size_group_ids: number[] | null;
    leaf_multiple_size_group_ids: number[] | null;
    shippable: boolean;
    author_field_visibility: number;
    brand_field_visibility: number;
    book_title_field_visibility: number;
    color_field_visibility: number;
    isbn_field_visibility: number;
    size_field_visibility: number;
    video_game_rating_field_visibility: number;
    measurements_field_visibility: boolean;
    condition_field_visible: boolean;
    restricted_to_status_id: number | null;
    landing: unknown | null; // Assuming this can be of any type or null.
    allow_browsing_subcategories: boolean;
    package_size_ids: number[];
    order: number;
    item_count: number;
    photo: Photo;
    unisex_catalog_id: number | null;
    catalogs: Catalog[]; // Recursive type
    url?: string;
    url_en?: string;
  };
  
  type CatalogsData = {
    catalogs: Catalog[];
  };

  
    export type { Catalog, CatalogsData };
