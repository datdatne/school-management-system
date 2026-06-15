# RoleControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRole**](#createrole) | **POST** /api/roles | |
|[**deleteRole**](#deleterole) | **DELETE** /api/roles/{id} | |
|[**getAllRoles**](#getallroles) | **GET** /api/roles | |
|[**getRoleById**](#getrolebyid) | **GET** /api/roles/{id} | |
|[**updateRole**](#updaterole) | **PUT** /api/roles/{id} | |

# **createRole**
> object createRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.createRole(
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRole**
> object deleteRole()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRole(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRoles**
> Array<Role> getAllRoles()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Role>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoleById**
> Role getRoleById()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRoleById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Role**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRole**
> object updateRole(roleRequest)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let id: number; // (default to undefined)
let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.updateRole(
    id,
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

