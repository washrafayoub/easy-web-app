To authenticate and authorization users on pages you need to tree easy steps:

1. Enable the security module,
2. implement an `authenticate(user,password)` function and
3. implement an `authorize(user,page)` function.

Optional: In HA set up, you need also implement 
* `createToken(userId){ ... return token }` and  
* `getUserIdForToken(token){ ... return userId }`
functions, typically using a distributed cache.