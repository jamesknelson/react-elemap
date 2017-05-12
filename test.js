const React = require('react')
const enzyme = require('enzyme')
const expect = require('chai').expect
const elemap = require('./elemap')
const jsdom = require('jsdom')
const c = React.createElement
const dom = new jsdom.JSDOM(`<!DOCTYPE html>`)

global.navigator = { userAgent: 'node.js' }
global.document = dom.window.document
global.window = dom.window


function TestList() {
  return (
    c('ul', { className: 'baby-names note' },
      c('li', { className: 'active' }, "Bangers"),
      c('li', {}, "Mash")
    )
  )
}

function createCounter() {
  let nextCount = 1
  return (el) => React.cloneElement(el, { count: nextCount++ })
}


describe('elemap', function() {
  it("transforms elements on non-children props of custom components", function() {
    function Test() {
      return elemap(
        c(TestList, { inner: c('div') }),
        createCounter()
      )
    }

    const wrapper = enzyme.mount(c(Test))
    expect(wrapper.find(TestList).first().props().inner.props.count).to.exist
  })

  it("doesn't transform elements of non-children props of html components", function() {
    function Test() {
      return elemap(
        c('main', { inner: c('div') }),
        createCounter()
      )
    }

    const wrapper = enzyme.mount(c(Test))
    expect(wrapper.find('main').first().props().inner.props.count).to.not.exist
  })

  it("doesn't transform elements that are owned by a different instance to the top element", function() {
    function Test() {
      return elemap(
        c('main', null, c(TestList)),
        createCounter()
      )
    }

    const wrapper = enzyme.mount(c(Test))
    expect(wrapper.find('li').first().props().count).to.not.exist
  })

  it('works from the bottom up', function() {
    function Test() {
      return elemap(
        c('main', null,
          c('article', null,
            c('h1', null, 'Test'),
            c(TestList)
          )
        ),
        createCounter()
      )
    }

    const wrapper = enzyme.mount(c(Test))
    expect(wrapper.find('h1').first().props().count).to.equal(1)
    expect(wrapper.find(TestList).first().props().count).to.equal(2)
    expect(wrapper.find('article').first().props().count).to.equal(3)
    expect(wrapper.find('main').first().props().count).to.equal(4)
  })
})
