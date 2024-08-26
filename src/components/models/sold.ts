import mongoose, { model } from 'mongoose';


const PhotoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  image_no: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  dominant_color: { type: String, required: true },
  dominant_color_opaque: { type: String, required: true },
  url: { type: String, required: true },
  is_main: { type: Boolean, required: true }
});

const UserPhotoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  temp_uuid: { type: String, default: null },
  url: { type: String, required: true },
  dominant_color: { type: String, required: true },
  dominant_color_opaque: { type: String, required: true }
});

const BusinessAccountSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  name: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  login: { type: String, required: true },
  item_count: { type: Number, required: true },
  followers_count: { type: Number, required: true },
  following_count: { type: Number, required: true },
  positive_feedback_count: { type: Number, required: true },
  neutral_feedback_count: { type: Number, required: true },
  negative_feedback_count: { type: Number, required: true },
  feedback_count: { type: Number, required: true },
  feedback_reputation: { type: Number, required: true },
  expose_location: { type: Boolean, required: true },
  city: { type: String, required: true },
  last_logged_on_ts: { type: Date, required: true },
  country_id: { type: Number, required: true },
  locale: { type: String, required: true },
  photo: { type: UserPhotoSchema, required: false },
  business_account: { type: BusinessAccountSchema, required: false },
  country_title_local: { type: String, required: true }
});

const BrandSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  is_favourite: { type: Boolean, required: true },
  path: { type: String, required: true }
});

const PriceSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency_code: { type: String, required: true }
});

const ServiceFeeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency_code: { type: String, required: true }
});

const SoldSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status_id: { type: Number, required: true },
  disposal_conditions: { type: Number, required: true },
  catalog_id: { type: Number, required: true },
  color1_id: { type: Number, required: true },
  package_size_id: { type: Number, required: true },
  currency: { type: String, required: true },
  photos: { type: [PhotoSchema], required: true },
  author: { type: String, default: null },
  book_title: { type: String, default: null },
  isbn: { type: String, default: null },
  measurement_width: { type: Number, default: null },
  measurement_length: { type: Number, default: null },
  measurement_unit: { type: String, default: null },
  price: { type: PriceSchema, required: true },
  discount: { type: Number, default: null },
  international_shipping_price: { type: Number, default: null },
  package_size_standard: { type: Boolean, required: true },
  shipment_prices: { type: Array, default: null },
  item_attributes: { type: Array, default: [] },
  favourite_count: { type: Number, required: true },
  is_favourite: { type: Boolean, required: true },
  view_count: { type: Number, required: true },
  user: { type: UserSchema, required: true },
  brand_dto: { type: BrandSchema, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  color1: { type: String, required: true },
  color2: { type: String, default: null },
  description_attributes: { type: Array, default: [] },
  status: { type: String, required: true },
  service_fee: { type: ServiceFeeSchema, required: true },
  total_item_price: { type: PriceSchema, required: true },
  size_title: { type: String, required: true },
  sold_days: { type: Number, required: true },
  last_check: { type: Number, required: true },
  all_categories: { type: Array, default: [] },
}, {collection: 'sold'});


interface IPhoto {
    id: number;
    image_no: number;
    width: number;
    height: number;
    dominant_color: string;
    dominant_color_opaque: string;
    url: string;
    is_main: boolean;
}

interface IUserPhoto {
    id: number;
    width: number;
    height: number;
    temp_uuid: string;
    url: string;
    dominant_color: string;
    dominant_color_opaque: string;
}

interface IBusinessAccount {
    id: number;
    user_id: number;
    name: string;
}

interface IUser {
    id: number;
    login: string;
    item_count: number;
    followers_count: number;
    following_count: number;
    positive_feedback_count: number;
    neutral_feedback_count: number;
    negative_feedback_count: number;
    feedback_count: number;
    feedback_reputation: number;
    expose_location: boolean;
    city: string;
    last_logged_on_ts: Date;
    country_id: number;
    locale: string;
    photo: IUserPhoto;
    business_account: IBusinessAccount;
    country_title_local: string;
}

interface IBrand {
    id: number;
    title: string;
    slug: string;
    is_favourite: boolean;
    
}

interface IPrice {
    amount: number;
    currency_code: string;
}


interface IServiceFee {
    amount: number;
    currency_code: string;
}

export interface ISold {
    _id: number;
    title: string;
    description: string;
    status_id: number;
    disposal_conditions: number;
    catalog_id: number;
    color1_id: number;
    package_size_id: number;
    currency: string;
    photos: Array<IPhoto>;
    author: string;
    book_title: string;
    isbn: string;
    measurement_width: number;
    measurement_length: number;
    measurement_unit: string;
    price: IPrice;
    discount: number;
    international_shipping_price: number;
    package_size_standard: boolean;
    shipment_prices: Array<any>;
    item_attributes: Array<any>;
    favourite_count: number;
    is_favourite: boolean;
    view_count: number;
    user: IUser;
    brand_dto: IBrand;
    path: string;
    url: string;
    color1: string;
    color2: string;
    description_attributes: Array<any>;
    status: string;
    service_fee: IServiceFee;
    total_item_price: IPrice;
    size_title: string;
    sold_days: number;
    last_check: number;
    all_categories: Array<number>;

}


    

export default mongoose.models.sold || model<ISold>('sold', SoldSchema);

//also export IEntry interface
export type { IPhoto };

