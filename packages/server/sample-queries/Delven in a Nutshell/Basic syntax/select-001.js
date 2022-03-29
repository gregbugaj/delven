// Different select types

select x, z from s.()

select x, z from s
select x, z from s.()
select x, z from () => {}


// Select from URI

select x, z from (http://www.google.com)
select x, z from http://source.com

select x, z from ['http://googl.com', 'http://www.src2.com']