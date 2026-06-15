# PdfControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**downloadPdf**](#downloadpdf) | **GET** /api/v1/pdf/download | |
|[**triggerEmail**](#triggeremail) | **POST** /api/v1/pdf/send-email | |

# **downloadPdf**
> Array<string> downloadPdf()


### Example

```typescript
import {
    PdfControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PdfControllerApi(configuration);

const { status, data } = await apiInstance.downloadPdf();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<string>**

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

# **triggerEmail**
> string triggerEmail()


### Example

```typescript
import {
    PdfControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PdfControllerApi(configuration);

const { status, data } = await apiInstance.triggerEmail();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

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

