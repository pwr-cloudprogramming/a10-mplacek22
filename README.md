# Jane Doe - Terraform, EC2, TicTacToe report

- Course: *Cloud programming*
- Group: monday 9:15
- Date: 25.06.2024

## Environment architecture

#### Provider
- **Region**: `us-east-1`

#### Cognito User Pool
- **Name**: `AppPool`
- **Password Policy**:
  - Minimum length: 8
  - Require uppercase, lowercase, numbers, symbols
  - Temporary password validity: 7 days
- **Deletion Protection**: `INACTIVE`
- **Schema Attributes**:
  - Various attributes like `profile`, `address`, `birthdate`, `gender`, `email`, etc.
  - Attributes are mostly mutable and optional
  - String attributes have max length constraints (2048)
- **Auto-Verified Attributes**: `email`
- **Verification Message Template**: `CONFIRM_WITH_CODE`
- **User Attribute Update Settings**: Verification required for email updates
- **MFA Configuration**: `OFF`
- **Email Configuration**: Sending account is `COGNITO_DEFAULT`
- **Admin Create User Config**: 
  - Admin create user only: `false`
  - Custom invite message templates
- **Username Configuration**: Case insensitive
- **Account Recovery**: Prioritizes verified email

#### Cognito User Pool Client
- **Name**: `public client`
- **User Pool ID**: References `test_pool`
- **Generate Secret**: `false`
- **Token Validity**:
  - Refresh token: 30 days
  - Access token: 60 minutes
  - ID token: 60 minutes
- **Attributes**:
  - Read/Write: `address`, `birthdate`, `email`, `family_name`, `gender`, etc.
- **Auth Flows**: 
  - ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_PASSWORD_AUTH, ALLOW_USER_SRP_AUTH
- **OAuth Settings**: Not enabled
- **Error and Token Settings**:
  - Prevent user existence errors: `ENABLED`
  - Token revocation: `true`
  - Auth session validity: 3 hours

## Preview

Screenshots of configured AWS services. Screenshots of your application running.

![Home page](img/img01.jpg)
![Sign up](img/sign_up.jpg)
![Confirm user](img/confirm_user.jpg)
![Sign in](img/sign_in.jpg)

## Reflections

- What did you learn?
    - how to use aws cognito for authentication and authorization
- What obstacles did you overcome?
    - passing the token to backend
- What did you help most in overcoming obstacles?
    - internet resources
- Was that something that surprised you?