# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios.spec.ts >> Scenario-based E2E Verification (Tier 4) >> test_journey_booking_with_dynamic_quote: select dates + services -> verify total price
- Location: tests\scenarios.spec.ts:58:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('text=Total a pagar').locator('..').locator('p.text-[var(--color-waldorf-mustard)]')
Expected substring: "$30.000"
Error: SyntaxError: Failed to execute 'querySelectorAll' on 'Element': 'p.text-[var(--color-waldorf-mustard)]' is not a valid selector.
    at query (<anonymous>:5448:41)
    at <anonymous>:5458:7
    at SelectorEvaluatorImpl._cached (<anonymous>:5235:20)
    at SelectorEvaluatorImpl._queryCSS (<anonymous>:5445:17)
    at SelectorEvaluatorImpl._querySimple (<anonymous>:5325:19)
    at <anonymous>:5273:29
    at SelectorEvaluatorImpl._cached (<anonymous>:5235:20)
    at SelectorEvaluatorImpl.query (<anonymous>:5266:19)
    at Object.query (<anonymous>:5480:44)
    at <anonymous>:5438:21

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('text=Total a pagar').locator('..').locator('p.text-[var(--color-waldorf-mustard)]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link "Colegio Waldorf Trekan Colegio Waldorf Trekan" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Colegio Waldorf Trekan" [ref=e6]
        - generic [ref=e7]:
          - generic [ref=e8]: Colegio Waldorf
          - generic [ref=e9]: Trekan
      - generic [ref=e10]:
        - link "Inicio" [ref=e11] [cursor=pointer]:
          - /url: /
        - button "Nosotros" [ref=e13]:
          - text: Nosotros
          - img [ref=e14]
        - button "Admisión 2026" [ref=e17]:
          - text: Admisión 2026
          - img [ref=e18]
        - link "Arriendo de Salón" [ref=e20] [cursor=pointer]:
          - /url: /arriendo-salon
        - link "Contacto" [ref=e21] [cursor=pointer]:
          - /url: /#contacto
        - generic [ref=e22]:
          - button "ES" [ref=e23]
          - generic [ref=e24]: "|"
          - button "DE" [ref=e25]
          - generic [ref=e26]: "|"
          - button "EN" [ref=e27]
    - generic [ref=e28]:
      - img "Salón Trekan" [ref=e30]
      - generic [ref=e32]:
        - generic [ref=e33]: Espacio Comunitario
        - heading "Arriendo de Salón" [level=1] [ref=e34]
        - paragraph [ref=e35]: Un refugio cálido y natural en Puerto Varas, diseñado para talleres, reuniones y actividades que nutran el alma comunitaria.
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - heading "Instalaciones & Ambiente" [level=2] [ref=e40]
          - paragraph [ref=e41]: Todo lo necesario para que tu actividad fluya.
        - generic [ref=e42]:
          - generic [ref=e45]:
            - heading "Propósito del Espacio" [level=3] [ref=e46]:
              - img [ref=e47]
              - text: Propósito del Espacio
            - paragraph [ref=e49]: Priorizamos actividades educativas, talleres de crecimiento personal, reuniones comunitarias y eventos que promuevan valores de respeto, conexión con la naturaleza y desarrollo humano integral.
            - generic [ref=e50]:
              - generic [ref=e51]: Catering externo permitido
              - generic [ref=e52]: Limpieza básica incluida
          - generic [ref=e53]:
            - generic [ref=e54]:
              - img [ref=e56]
              - heading "Amplitud" [level=4] [ref=e61]
              - paragraph [ref=e62]: 25m² de espacio (hasta 20 personas).
            - generic [ref=e63]:
              - img [ref=e65]
              - heading "Versatilidad" [level=4] [ref=e67]
              - paragraph [ref=e68]: Mesas y sillas modulares adaptables a cualquier formato.
          - generic [ref=e69]:
            - generic [ref=e70]:
              - img [ref=e72]
              - heading "Comodidades" [level=4] [ref=e74]
              - paragraph [ref=e75]: Cocina equipada y baño de uso común.
            - generic [ref=e76]:
              - img [ref=e78]
              - heading "Luz Natural" [level=4] [ref=e80]
              - paragraph [ref=e81]: Ambiente cálido, rodeado de madera y naturaleza.
          - generic [ref=e82]:
            - generic [ref=e84]:
              - heading "Disponibilidad" [level=3] [ref=e85]:
                - img [ref=e86]
                - text: Disponibilidad
              - list [ref=e88]:
                - listitem [ref=e89]:
                  - text: •
                  - strong [ref=e90]: "Lunes a Viernes:"
                  - text: Post 15:00 hrs.
                - listitem [ref=e91]:
                  - text: •
                  - strong [ref=e92]: "Fin de Semana:"
                  - text: Todo el día.
                - listitem [ref=e93]:
                  - text: •
                  - strong [ref=e94]: "Vacaciones:"
                  - text: Horario flexible.
            - link "Consultar Fechas" [ref=e96] [cursor=pointer]:
              - /url: https://wa.me/56967765106
      - generic [ref=e97]:
        - heading "Tarifas Transparentes" [level=2] [ref=e99]
        - generic [ref=e100]:
          - generic [ref=e101]:
            - heading "Bloque Corto" [level=4] [ref=e102]
            - paragraph [ref=e103]: $10.000
            - paragraph [ref=e104]: por hora
            - paragraph [ref=e105]: 1 a 3 horas
          - generic [ref=e106]:
            - generic [ref=e107]: Más Solicitado
            - heading "Medio Día" [level=4] [ref=e108]
            - paragraph [ref=e109]: $9.000
            - paragraph [ref=e110]: por hora
            - paragraph [ref=e111]: 4 a 6 horas
          - generic [ref=e112]:
            - heading "Jornada Completa" [level=4] [ref=e113]
            - paragraph [ref=e114]: $50.000
            - paragraph [ref=e115]: fijo por día
            - paragraph [ref=e116]: 7 horas completas
    - generic [ref=e118]:
      - generic [ref=e119]:
        - heading "Reserva tu Espacio" [level=2] [ref=e120]
        - paragraph [ref=e121]: Cotiza en tiempo real y agenda directamente con nuestro equipo.
      - generic [ref=e122]:
        - generic [ref=e123]:
          - generic [ref=e124]:
            - heading "Tu Cotización" [level=3] [ref=e125]
            - generic [ref=e126]:
              - generic [ref=e127]:
                - paragraph [ref=e128]: Horas Totales
                - paragraph [ref=e129]: 3.0 hrs
              - generic [ref=e131]:
                - paragraph [ref=e132]: Valor Salón
                - paragraph [ref=e133]: $30.000
              - generic [ref=e134]:
                - paragraph [ref=e135]: Servicios Extra
                - paragraph [ref=e136]: $0
          - generic [ref=e137]:
            - paragraph [ref=e138]: Total a pagar
            - paragraph [ref=e139]: $30.000
            - generic [ref=e140]:
              - generic [ref=e141]: "Reserva: $9.000"
              - generic [ref=e142]: "Saldo: $21.000"
        - generic [ref=e144]:
          - generic [ref=e145]:
            - generic [ref=e146]: Paso 1 de 3
            - heading "¿Cuándo necesitas el salón?" [level=2] [ref=e147]
            - generic [ref=e149]:
              - heading "Día 1" [level=4] [ref=e150]
              - generic [ref=e151]:
                - generic [ref=e152]:
                  - generic [ref=e153]: Fecha
                  - textbox [ref=e154]
                - generic [ref=e155]:
                  - generic [ref=e156]: Inicio
                  - textbox [ref=e157]: 10:00
                - generic [ref=e158]:
                  - generic [ref=e159]: Fin
                  - textbox [active] [ref=e160]: 13:00
            - button "Agregar otro día" [ref=e161]:
              - img [ref=e162]
              - text: Agregar otro día
          - button "Siguiente" [disabled] [ref=e164]:
            - text: Siguiente
            - img [ref=e165]
    - generic [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - generic [ref=e170]:
            - generic [ref=e171]: T
            - generic [ref=e172]: TREKAN
          - paragraph [ref=e173]: Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
          - generic [ref=e174]:
            - link [ref=e175] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e176]
            - link [ref=e179] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e180]
        - generic [ref=e182]:
          - heading "Contacto" [level=4] [ref=e183]
          - list [ref=e184]:
            - listitem [ref=e185]:
              - img [ref=e186]
              - generic [ref=e188]: +56 9 6776 5106
            - listitem [ref=e189]:
              - img [ref=e190]
              - link "admision@colegiowaldorftrekan.cl" [ref=e193] [cursor=pointer]:
                - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
            - listitem [ref=e194]:
              - img [ref=e195]
              - generic [ref=e198]: Las Azaleas 96, Parque Ivian 1, Puerto Varas
        - generic [ref=e199]:
          - heading "Navegación" [level=4] [ref=e200]
          - list [ref=e201]:
            - listitem [ref=e202]:
              - link "Quiénes Somos" [ref=e203] [cursor=pointer]:
                - /url: /#quienes-somos
            - listitem [ref=e204]:
              - link "Pedagogía Waldorf" [ref=e205] [cursor=pointer]:
                - /url: /#pedagogia
            - listitem [ref=e206]:
              - link "Admisión 2026" [ref=e207] [cursor=pointer]:
                - /url: /#admision
            - listitem [ref=e208]:
              - link "Arriendo de Salón" [ref=e209] [cursor=pointer]:
                - /url: /arriendo-salon
      - generic [ref=e210]:
        - paragraph [ref=e211]: © 2026 Colegio Waldorf Trekan - Puerto Varas
        - paragraph [ref=e212]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
        - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e213] [cursor=pointer]:
          - /url: /recursos-waldorf-chile
  - button "Contactar por WhatsApp" [ref=e216]:
    - img [ref=e217]
  - generic [ref=e221]:
    - generic [ref=e222]: ¿Dudas? ¡Pregúntame! 🌱
    - button "Abrir Chat" [ref=e224]:
      - img [ref=e226]
      - generic [ref=e229]: "1"
  - alert [ref=e230]
  - img [ref=e233]
```