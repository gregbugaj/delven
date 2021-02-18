// Statement scoped context

using new MockContext()
select css('#test'), css('#test') from source() where(x == 1 || true)