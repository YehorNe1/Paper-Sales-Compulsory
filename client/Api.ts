/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AssignPropertyDto {
  /** @format int32 */
  paperId: number;
  /** @format int32 */
  propertyId: number;
}

export interface Customer {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  address?: string | null;
  /**
   * @format tel
   * @minLength 0
   * @maxLength 50
   */
  phone?: string | null;
  /**
   * @format email
   * @minLength 0
   * @maxLength 255
   */
  email?: string | null;
  orders?: Order[] | null;
}

export interface Order {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate: string;
  /** @format date */
  deliveryDate?: string | null;
  /**
   * @minLength 0
   * @maxLength 50
   */
  status: string;
  /**
   * @format double
   * @min 0
   */
  totalAmount?: number;
  /** @format int32 */
  customerId: number;
  customer?: Customer;
  orderEntries?: OrderEntry[] | null;
}

export interface OrderEntry {
  /** @format int32 */
  id?: number;
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  quantity?: number;
  /** @format int32 */
  productId: number;
  /** @format int32 */
  orderId: number;
  order?: Order;
  product?: Paper;
}

export interface OrderEntryDto {
  /** @format int32 */
  productId: number;
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  quantity?: number;
}

export interface OrderPlacementDto {
  /** @format int32 */
  customerId: number;
  /** @format date-time */
  orderDate: string;
  /** @format date */
  deliveryDate?: string | null;
  /**
   * @minLength 0
   * @maxLength 50
   */
  status: string;
  /** @minItems 1 */
  orderEntries: OrderEntryDto[];
}

export interface Paper {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  discontinued?: boolean;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  stock?: number;
  /**
   * @format double
   * @min 0.01
   */
  price?: number;
  orderEntries?: OrderEntry[] | null;
  properties?: Property[] | null;
}

export interface PaperCreateDto {
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  discontinued?: boolean;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  stock?: number;
  /**
   * @format double
   * @min 0.01
   */
  price?: number;
}

export interface PaperUpdateDto {
  /** @format int32 */
  id: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  name: string;
  discontinued?: boolean;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  stock?: number;
  /**
   * @format double
   * @min 0.01
   */
  price?: number;
}

export interface Property {
  /** @format int32 */
  id?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  propertyName: string;
  papers?: Paper[] | null;
}

export interface UpdateOrderStatusDto {
  /**
   * @minLength 0
   * @maxLength 50
   */
  status: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title server
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Customer
     * @name CustomerList
     * @request GET:/api/Customer
     */
    customerList: (params: RequestParams = {}) =>
      this.request<Customer[], any>({
        path: `/api/Customer`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerCreate
     * @request POST:/api/Customer
     */
    customerCreate: (data: Customer, params: RequestParams = {}) =>
      this.request<Customer, any>({
        path: `/api/Customer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerDetail
     * @request GET:/api/Customer/{id}
     */
    customerDetail: (id: number, params: RequestParams = {}) =>
      this.request<Customer, any>({
        path: `/api/Customer/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerUpdate
     * @request PUT:/api/Customer/{id}
     */
    customerUpdate: (id: number, data: Customer, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Customer/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerDelete
     * @request DELETE:/api/Customer/{id}
     */
    customerDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Customer/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerOrdersDetail
     * @request GET:/api/Customer/{id}/Orders
     */
    customerOrdersDetail: (id: number, params: RequestParams = {}) =>
      this.request<Order[], any>({
        path: `/api/Customer/${id}/Orders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderList
     * @request GET:/api/Order
     */
    orderList: (params: RequestParams = {}) =>
      this.request<Order[], any>({
        path: `/api/Order`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDetail
     * @request GET:/api/Order/{id}
     */
    orderDetail: (id: number, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/api/Order/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderUpdate
     * @request PUT:/api/Order/{id}
     */
    orderUpdate: (id: number, data: Order, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Order/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDelete
     * @request DELETE:/api/Order/{id}
     */
    orderDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Order/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderPlaceCreate
     * @request POST:/api/Order/Place
     */
    orderPlaceCreate: (data: OrderPlacementDto, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/api/Order/Place`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderStatusUpdate
     * @request PUT:/api/Order/{id}/Status
     */
    orderStatusUpdate: (id: number, data: UpdateOrderStatusDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Order/${id}/Status`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderAllList
     * @request GET:/api/Order/All
     */
    orderAllList: (
      query?: {
        adminKey?: string;
        /** @format int32 */
        customerId?: number;
        status?: string;
        /** @format date-time */
        startDate?: string;
        /** @format date-time */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Order[], any>({
        path: `/api/Order/All`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryList
     * @request GET:/api/OrderEntry
     */
    orderEntryList: (params: RequestParams = {}) =>
      this.request<OrderEntry[], any>({
        path: `/api/OrderEntry`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryCreate
     * @request POST:/api/OrderEntry
     */
    orderEntryCreate: (data: OrderEntry, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/api/OrderEntry`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryDetail
     * @request GET:/api/OrderEntry/{id}
     */
    orderEntryDetail: (id: number, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/api/OrderEntry/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryUpdate
     * @request PUT:/api/OrderEntry/{id}
     */
    orderEntryUpdate: (id: number, data: OrderEntry, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/OrderEntry/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryDelete
     * @request DELETE:/api/OrderEntry/{id}
     */
    orderEntryDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/OrderEntry/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperList
     * @request GET:/api/Paper
     */
    paperList: (
      query?: {
        search?: string;
        sortBy?: string;
        /** @format double */
        minPrice?: number;
        /** @format double */
        maxPrice?: number;
        discontinued?: boolean;
        /** @default false */
        sortDescending?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper[], any>({
        path: `/api/Paper`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperCreate
     * @request POST:/api/Paper
     */
    paperCreate: (data: PaperCreateDto, params: RequestParams = {}) =>
      this.request<Paper, any>({
        path: `/api/Paper`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDetail
     * @request GET:/api/Paper/{id}
     */
    paperDetail: (id: number, params: RequestParams = {}) =>
      this.request<Paper, any>({
        path: `/api/Paper/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperUpdate
     * @request PUT:/api/Paper/{id}
     */
    paperUpdate: (id: number, data: PaperUpdateDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDelete
     * @request DELETE:/api/Paper/{id}
     */
    paperDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDiscontinueUpdate
     * @request PUT:/api/Paper/{id}/Discontinue
     */
    paperDiscontinueUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/${id}/Discontinue`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperRestockUpdate
     * @request PUT:/api/Paper/{id}/Restock
     */
    paperRestockUpdate: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Paper/${id}/Restock`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyList
     * @request GET:/api/Property
     */
    propertyList: (params: RequestParams = {}) =>
      this.request<Property[], any>({
        path: `/api/Property`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyCreate
     * @request POST:/api/Property
     */
    propertyCreate: (data: Property, params: RequestParams = {}) =>
      this.request<Property, any>({
        path: `/api/Property`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyDetail
     * @request GET:/api/Property/{id}
     */
    propertyDetail: (id: number, params: RequestParams = {}) =>
      this.request<Property, any>({
        path: `/api/Property/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyUpdate
     * @request PUT:/api/Property/{id}
     */
    propertyUpdate: (id: number, data: Property, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Property/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyDelete
     * @request DELETE:/api/Property/{id}
     */
    propertyDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Property/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyAssignToPaperCreate
     * @request POST:/api/Property/AssignToPaper
     */
    propertyAssignToPaperCreate: (data: AssignPropertyDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Property/AssignToPaper`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
