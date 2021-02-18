---
title: WITH
weight: 0
type: page

menu:
  main:
    parent: syntax
---


Common Table Expressions

A common table expression (CTE) can be thought of as a temporary result set that is defined within the execution scope of a single SELECT.
CTE can be self-referencing and can be referenced multiple times in the same query.


## Arguments
#### expression_name
Is a valid identifier for the common table expression. expression_name must be different from the name of any other common table expression defined in the same WITH  clause

#### column_name
Specifies a column name in the common table expression. Duplicate names within a single CTE definition are not allowed. The number of column names specified must match the number of columns in the result set of the cte_query_definition

#### cte_query_definition
Specifies a SELECT statement whose result set populates the common table expression

## Examples

### A. Basic usage
The following example shows the components of the CTE structure: expression name, column list, and query. 
The CTE expression 'data_cte' has two columns (title, note) and is defined as extraction from a inner query.

```sql
WITH data_cte (title, note) 
(
    SELECT css("#title") as title, css("#note") as note
    FROM  http://www.delven.io/test/index-01.html
)

SELECT * FROM data_cte
```

### B. Complex CTE query
The following example shows more complex CTE query.

```sql
WITH OauthData (token)
(
    SELECT  data as token
    FROM http://www.delven.io/test/index-01.html
    USING :
    {
        "method" : "POST",
        "params" :
        {
                "access_token": "xyz",
                "token_type" : "bearer",
                "refresh_token" : "abc",
                "expires_in": 23213
        }
    }
)

SELECT token FROM OauthData
```


### C. Multiple CTE's
Multiple CTE's can be specified by separating them with a comma.


```sql
WITH data_A (title, note) 
(
    SELECT css("#title") as title, css("#description") as note
    FROM  http://www.delven.io/test/index-01.html
),

data_B (title, note) 
(
    SELECT css("#title") as title, css("#detail") as note
    FROM  http://www.delven.io/test/index-02.html
)

```
