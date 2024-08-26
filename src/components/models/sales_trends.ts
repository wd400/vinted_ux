
interface SalesTrend {
    _id: {
        catalog_id: number;
        brand_title: string | null;
    };
    count: number;
    mean_price: number;
    mean_sold_days: number;
    sum_price: number;
}

export default SalesTrend;
export type SalesTrends = SalesTrend[];