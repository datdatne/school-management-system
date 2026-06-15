# StudentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStudent**](#createstudent) | **POST** /api/students | |
|[**deleteStudent**](#deletestudent) | **DELETE** /api/students/{id} | |
|[**getAllStudents**](#getallstudents) | **GET** /api/students | |
|[**getStudentById**](#getstudentbyid) | **GET** /api/students/{id} | |
|[**updateStudent**](#updatestudent) | **PUT** /api/students/{id} | |

# **createStudent**
> object createStudent(studentCreateRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentCreateRequest: StudentCreateRequest; //

const { status, data } = await apiInstance.createStudent(
    studentCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentCreateRequest** | **StudentCreateRequest**|  | |


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

# **deleteStudent**
> object deleteStudent()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteStudent(
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

# **getAllStudents**
> PageStudentResponse getAllStudents()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)
let sort: Array<string>; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllStudents(
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|
| **sort** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|


### Return type

**PageStudentResponse**

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

# **getStudentById**
> object getStudentById()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStudentById(
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

# **updateStudent**
> object updateStudent(studentUpdateRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)
let studentUpdateRequest: StudentUpdateRequest; //

const { status, data } = await apiInstance.updateStudent(
    id,
    studentUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentUpdateRequest** | **StudentUpdateRequest**|  | |
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

