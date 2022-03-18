<script lang="ts">
  import {
    Collapse,
    Container,
    Nav,
    Navbar,
    NavbarToggler,
    NavItem,
  } from 'sveltestrap'
  import appNavigator from '../routes'
  import { active, link } from '../util/router'

  const expand = 'sm'
  let isOpen = false

  function handleNavbarUpdate(e: CustomEvent<boolean>) {
    isOpen = e.detail
  }

  function toggleNavbar() {
    isOpen = !isOpen
  }
</script>

<Navbar container color="primary" dark {expand}>
  <a class="navbar-brand" href="/" use:link>StockAcc</a>
  <NavbarToggler on:click={toggleNavbar} />
  <Collapse {isOpen} {expand} on:update={handleNavbarUpdate} navbar>
    <Nav navbar>
      <NavItem>
        <a
          href={appNavigator.routes.customers}
          class="nav-link"
          use:link
          use:active
          data-when={appNavigator.routes.customers}
        >
          Clientes
        </a>
      </NavItem>
      <NavItem>
        <a
          href={appNavigator.routes.maintenance}
          class="nav-link"
          use:link
          use:active
          data-when={appNavigator.routes.maintenance}
        >
          Manutenção
        </a>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<div class="mt-3">
  <slot />
</div>
