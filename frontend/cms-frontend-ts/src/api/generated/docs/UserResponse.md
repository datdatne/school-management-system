# UserResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**fullname** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**roles** | [**Set&lt;RoleResponse&gt;**](RoleResponse.md) |  | [optional] [default to undefined]
**student** | [**StudentBasicInfo**](StudentBasicInfo.md) |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { UserResponse } from './api';

const instance: UserResponse = {
    id,
    username,
    email,
    fullname,
    createdAt,
    updatedAt,
    roles,
    student,
    active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
