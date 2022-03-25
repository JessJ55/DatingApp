export interface Pagination{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;

}

export class PaginatedResult<T> { //T es Member[]
    result: T;
    pagination: Pagination;
}