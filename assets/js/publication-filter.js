(function () {
  var container = document.querySelector('[data-filter-list]');
  if (!container) return;

  var items = container.querySelectorAll('[data-tags]');
  var pills = document.querySelectorAll('.filter-pill');
  var noUrl = container.hasAttribute('data-no-url');
  var activeTag = '';

  function getActiveTag() {
    if (noUrl) return activeTag;
    var params = new URLSearchParams(window.location.search);
    return params.get('tag') || '';
  }

  function setActiveTag(tag) {
    if (noUrl) {
      activeTag = tag;
      return;
    }
    var url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }
    history.pushState(null, '', url.toString());
  }

  function filterItems(tag) {
    items.forEach(function (item) {
      if (!tag) {
        item.style.display = '';
      } else {
        var tags = (item.getAttribute('data-tags') || '').split(' ');
        item.style.display = tags.indexOf(tag) !== -1 ? '' : 'none';
      }
    });
  }

  function updatePills(activeTag) {
    pills.forEach(function (pill) {
      var pillTag = pill.getAttribute('data-tag');
      pill.classList.toggle('active', pillTag === activeTag);
    });
  }

  function apply(tag) {
    filterItems(tag);
    updatePills(tag);
  }

  function closeMobilePanel() {
    var panel = document.getElementById('research-filter-panel');
    if (!panel || !panel.classList.contains('show')) return;
    if (window.bootstrap && bootstrap.Collapse) {
      var instance = bootstrap.Collapse.getInstance(panel);
      if (instance) instance.hide();
    }
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var tag = pill.getAttribute('data-tag');
      setActiveTag(tag);
      apply(tag);
      closeMobilePanel();
    });
  });

  var articleTagBtns = container.querySelectorAll('.pub-tag-btn');
  articleTagBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-tag');
      setActiveTag(tag);
      apply(tag);
      closeMobilePanel();
    });
  });

  apply(getActiveTag());

  if (!noUrl) {
    window.addEventListener('popstate', function () {
      apply(getActiveTag());
    });
  }
})();
