---
title: SUBQUERIES
weight: 0
type: page

menu:
  main:
    parent: syntax
---

[//]: # (http://www.informit.com/articles/article.aspx?p=2036581&seqNum=9)
[//]: # (https://www.essentialsql.com/get-ready-to-learn-sql-server-22-using-subqueries-in-the-from-clause/)

A subquery is a [SELECT](/syntax/select) statement written within parentheses and nested inside another statement. 

Subqueries can return different types of information:

* A scalar subquery returns a single value.
* A column subquery returns a single column of one or more values.
* A row subquery returns a single row of one or more values.
* A table subquery returns a table of one or more rows of one or more columns.

Subquery results can be tested in different ways:

* Scalar subquery results can be evaluated using relative comparison operators such as = or <.
* IN and NOT IN test whether a value is present in a set of values returned by a subquery.
* ALL, ANY, SOME compare a value to the set of values returned by a subquery.
* EXISTS and NOT EXISTS test whether a subquery result is empty.


## Arguments

## Examples

### A. Subqueries in the FROM Clause
Subqueries can be used in the FROM clause to generate values. In this case, the result of the subquery acts like a table. A subquery in the FROM clause can participate in joins, its values can be tested in the WHERE clause, and so forth. With this type of subquery, you must provide a table alias to give the subquery result a name:

```sql
SELECT q1.title, q1.name FROM 
(
	SELECT  css('#title') as title,  css('#name') as name
	FROM css('#root-selector')
	WITHIN http://www.delven.io/test/index-01.html
) q1
```
[Run in Console](#console)

```sql
 SELECT * FROM (SELECT 1, 2) AS t1 INNER JOIN (SELECT 3, 4) AS t2;
```
[Run in Console](#console)


### B. Subqueries with Relative Comparison Operators
The =, <>, >, >=, <, and <= operators perform relative-value comparisons. When used with a scalar subquery, they find all rows in the outer query that stand in particular relationship to the value returned by the subquery


```sql
SELECT * FROM score
WHERE event_id =
(SELECT event_id FROM grade_event
   WHERE date = '2012-09-23' AND category = 'Q');
```


### Tuple Comparsion

If a subquery returns a single row, you can use a row constructor to compare a set of values (that is, a tuple) to the subquery result. This statement returns rows for presidents who were born in the same city and state as John Adams:

```sql
 SELECT last_name, first_name, city, state FROM president
     WHERE (city, state) =
     (SELECT city, state FROM president
        WHERE last_name = 'Adams' AND first_name = 'John');
```


### C. IN and NOT IN Subqueries

The IN and NOT IN operators can be used when a subquery returns multiple rows to be evaluated in comparison to the outer query. They test whether a comparison value is present in a set of values. IN is true for rows in the outer query that match any row returned by the subquery. NOT IN is true for rows in the outer query that match no rows returned by the subquery. The following statements use IN and NOT IN to find those students who have absences listed in the absence table, and those who have perfect attendance (no absences):

```sql
 SELECT * FROM student
  WHERE student_id IN (SELECT student_id FROM absence);
```

```sql
 SELECT * FROM student
  WHERE student_id NOT IN (SELECT student_id FROM absence);
```

IN and NOT IN also work for subqueries that return multiple columns. In other words, you can use them with table subqueries. In this case, use a row constructor to specify the comparison values to test against each column:

```sql
SELECT last_name, first_name, city, state FROM president
     WHERE (city, state) IN
     (SELECT city, state FROM president
     WHERE last_name = 'Roosevelt');
```

### ALL, ANY  Subqueries

The ALL and ANY operators are used in conjunction with a relative comparison operator to test the result of a column subquery. They test whether the comparison value stands in particular relationship to all or some of the values returned by the subquery. For example, <= ALL is true if the comparison value is less than or equal to every value that the subquery returns, whereas <= ANY is true if the comparison value is less than or equal to any value that the subquery returns. SOME is a synonym for ANY.

This statement determines which president was born first by selecting the row with a birth date less than or equal to all the birth dates in the president table (only the earliest date satisfies this condition):

```sql
SELECT last_name, first_name, birth FROM president
    WHERE birth <= ALL (SELECT birth FROM president);
```


When ALL or ANY are used with the = comparison operator, the subquery can be a table subquery. In this case, you test return rows using a row constructor to provide the comparison values

```sql
 SELECT last_name, first_name, city, state FROM president
     WHERE (city, state) = ANY
     (SELECT city, state FROM president
     WHERE last_name = 'Roosevelt');
```


### EXISTS and NOT EXISTS Subqueries

The EXISTS and NOT EXISTS operators merely test whether a subquery returns any rows. If it does, EXISTS is true and NOT EXISTS is false. The following statements show some trivial examples of these subqueries. The first returns 0 if the absence table is empty, the second returns 1:

```sql
  SELECT EXISTS (SELECT * FROM absence);
  SELECT NOT EXISTS (SELECT * FROM absence);
```