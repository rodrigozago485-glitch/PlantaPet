import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

function criarIconePlanta() {
  return L.divIcon({
    className: "marcador-planta-container",
    html: '<div class="marcador-planta-real">🌱</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 38],
    popupAnchor: [0, -35],
  });
}

function criarIconePlantaSelecionada() {
  return L.divIcon({
    className: "marcador-planta-container marcador-planta-ativa",
    html: `
      <div class="marcador-planta-destaque">
        <div class="marcador-planta-pulso"></div>
        <div class="marcador-planta-real">🌱</div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 54],
    popupAnchor: [0, -50],
  });
}

function criarIconePlantaEmAlerta() {
  return L.divIcon({
    className: "marcador-planta-container marcador-planta-alerta",
    html: `
      <div class="marcador-planta-alerta-destaque">
        <div class="marcador-planta-alerta-pulso"></div>
        <div class="marcador-planta-alerta-real">🌱</div>
      </div>
    `,
    iconSize: [70, 70],
    iconAnchor: [35, 59],
    popupAnchor: [0, -55],
  });
}

const iconePlanta = criarIconePlanta();
const iconePlantaSelecionada = criarIconePlantaSelecionada();
const iconePlantaEmAlerta = criarIconePlantaEmAlerta();

function AjustarVisualizacao({
  plantas,
  plantaSelecionada,
  alertaIrrigacao,
}) {
  const mapa = useMap();

  useEffect(() => {
    if (alertaIrrigacao && plantaSelecionada) {
      const latitude = Number(plantaSelecionada.latitude);
      const longitude = Number(plantaSelecionada.longitude);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        mapa.flyTo([latitude, longitude], 18, {
          animate: true,
          duration: 1.4,
        });
      }
      return;
    }

    if (plantaSelecionada) {
      const latitude = Number(plantaSelecionada.latitude);
      const longitude = Number(plantaSelecionada.longitude);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        mapa.flyTo([latitude, longitude], 17, {
          animate: true,
          duration: 1.2,
        });
      }
      return;
    }

    if (plantas.length === 1) {
      mapa.flyTo(
        [Number(plantas[0].latitude), Number(plantas[0].longitude)],
        16,
        { animate: true, duration: 1 }
      );
      return;
    }

    if (plantas.length > 1) {
      const limites = L.latLngBounds(
        plantas.map((planta) => [
          Number(planta.latitude),
          Number(planta.longitude),
        ])
      );

      mapa.fitBounds(limites, {
        padding: [45, 45],
        maxZoom: 16,
        animate: true,
      });
    }
  }, [plantas, plantaSelecionada, alertaIrrigacao, mapa]);

  return null;
}

export default function MapaPlantas({
  plantas = [],
  plantaSelecionada = null,
  alertaIrrigacao = false,
  aoSelecionarPlanta,
  aoSimularAlerta,
  aoEncerrarSimulacao,
}) {
  const plantasComLocalizacao = useMemo(
    () =>
      plantas.filter((planta) => {
        const latitude = Number(planta.latitude);
        const longitude = Number(planta.longitude);

        return (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          planta.latitude !== null &&
          planta.longitude !== null
        );
      }),
    [plantas]
  );

  const plantaSelecionadaNoMapa = useMemo(() => {
    if (!plantaSelecionada) return null;

    return plantasComLocalizacao.find(
      (planta) => planta.id === plantaSelecionada.id
    ) || null;
  }, [plantasComLocalizacao, plantaSelecionada]);

  const centro = useMemo(() => {
    if (!plantasComLocalizacao.length) return null;

    const latitude =
      plantasComLocalizacao.reduce(
        (total, planta) => total + Number(planta.latitude),
        0
      ) / plantasComLocalizacao.length;

    const longitude =
      plantasComLocalizacao.reduce(
        (total, planta) => total + Number(planta.longitude),
        0
      ) / plantasComLocalizacao.length;

    return [latitude, longitude];
  }, [plantasComLocalizacao]);

  const alertaAtivo = Boolean(alertaIrrigacao && plantaSelecionadaNoMapa);

  return (
    <section className="mapa-plantas-secao">
      <div className="mapa-plantas-cabecalho">
        <div>
          <h2>Mapa das minhas plantas</h2>
          <p>
            Veja no mapa os locais informados no cadastro de cada planta.
          </p>
        </div>

        <span className="mapa-contador-plantas">
          {plantasComLocalizacao.length}{" "}
          {plantasComLocalizacao.length === 1
            ? "planta localizada"
            : "plantas localizadas"}
        </span>
      </div>

      <div className="mapa-simulacao-controles">
        <div>
          <strong>Teste</strong>
          <small>
            Escolha uma planta para fazer a simulação de alerta
          </small>
        </div>

        {alertaAtivo ? (
          <button
            type="button"
            className="botao-encerrar-simulacao"
            onClick={aoEncerrarSimulacao}
          >
            Encerrar simulação
          </button>
        ) : (
          <button
            type="button"
            className="botao-simular-irrigacao"
            onClick={aoSimularAlerta}
            disabled={!plantaSelecionadaNoMapa}
            title={
              plantaSelecionadaNoMapa
                ? "Simular que esta planta precisa de irrigação"
                : "Selecione uma planta com localização no mapa primeiro"
            }
          >
            Simular necessidade de irrigação
          </button>
        )}
      </div>

      {!plantaSelecionadaNoMapa && plantasComLocalizacao.length > 0 && (
        <p className="mapa-simulacao-ajuda">
          Para testar, selecione uma planta na lista abaixo.
        </p>
      )}

      {plantasComLocalizacao.length > 0 ? (
        <>
          {alertaAtivo && (
            <div className="mapa-alerta-irrigacao" role="alert">
              <span className="mapa-alerta-irrigacao-icone">!</span>
              <div>
                <strong>Atenção! Esta planta precisa de irrigação.</strong>
                <small>
                  {plantaSelecionadaNoMapa.nome} está em alerta na simulação.
                </small>
              </div>
            </div>
          )}

          {plantaSelecionadaNoMapa && !alertaAtivo && (
            <div className="mapa-planta-selecionada">
              <span className="mapa-planta-selecionada-icone">🌱</span>
              <div>
                <strong>{plantaSelecionadaNoMapa.nome}</strong>
                <small>Planta selecionada no mapa</small>
              </div>
            </div>
          )}

          <div className="mapa-plantas">
            <MapContainer
              key={plantasComLocalizacao
                .map(
                  (planta) =>
                    `${planta.id}-${planta.latitude}-${planta.longitude}`
                )
                .join("_")}
              center={centro}
              zoom={15}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <AjustarVisualizacao
                plantas={plantasComLocalizacao}
                plantaSelecionada={plantaSelecionadaNoMapa}
                alertaIrrigacao={alertaAtivo}
              />

              {plantasComLocalizacao.map((planta) => {
                const selecionada =
                  plantaSelecionadaNoMapa?.id === planta.id;
                const emAlerta = alertaAtivo && selecionada;

                return (
                  <Marker
                    key={planta.id}
                    position={[
                      Number(planta.latitude),
                      Number(planta.longitude),
                    ]}
                    icon={
                      emAlerta
                        ? iconePlantaEmAlerta
                        : selecionada
                          ? iconePlantaSelecionada
                          : iconePlanta
                    }
                    zIndexOffset={emAlerta ? 2000 : selecionada ? 1000 : 0}
                  >
                    <Popup>
                      <div className="popup-planta-real">
                        <strong>{planta.nome}</strong>
                        <span>{planta.tipo}</span>
                        <span>
                          {[
                            planta.endereco,
                            planta.numero,
                            planta.bairro,
                            planta.cidade,
                            planta.estado,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>

                        {planta.cep && (
                          <small>CEP: {planta.cep}</small>
                        )}

                        {emAlerta ? (
                          <small className="popup-planta-alerta">
                            Precisa de irrigação
                          </small>
                        ) : selecionada ? (
                          <small className="popup-planta-status">
                            Planta selecionada
                          </small>
                        ) : null}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          <div className="mapa-legenda-real">
            <span>
              <i />
              Marcador de planta cadastrada
            </span>
            <span className="mapa-legenda-selecionada">
              <i />
              Planta selecionada
            </span>
            {alertaAtivo && (
              <span className="mapa-legenda-alerta">
                <i />
                Precisa de irrigação
              </span>
            )}
          </div>

          <div className="mapa-lista-real">
            {plantasComLocalizacao.map((planta) => {
              const selecionada =
                plantaSelecionadaNoMapa?.id === planta.id;

              return (
                <button
                  type="button"
                  className={`mapa-item-real ${
                    selecionada
                      ? "mapa-item-real-selecionado"
                      : ""
                  }`}
                  key={planta.id}
                  onClick={() => aoSelecionarPlanta?.(planta)}
                  aria-pressed={selecionada}
                >
                  <div>
                    <strong>{planta.nome}</strong>
                    <small>{planta.tipo}</small>
                  </div>

                  <span>
                    {[
                      planta.endereco,
                      planta.numero,
                      planta.bairro,
                      planta.cidade,
                      planta.estado,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>

                  {selecionada && (
                    <span className="mapa-item-status">Selecionada</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mapa-sem-plantas">
          <div className="mapa-sem-plantas-icone">⌖</div>
          <h3>Nenhuma planta posicionada no mapa</h3>
          <p>
            Ao cadastrar uma planta, informe o CEP ou endereço.
            Ela aparecerá aqui automaticamente.
          </p>

          {plantas.length > 0 && (
            <small>
              Você já tem plantas cadastradas sem coordenadas.
              Edite cada uma e informe a localização para adicioná-la ao mapa.
            </small>
          )}
        </div>
      )}

      <p className="mapa-aviso-real">
        As posições são obtidas a partir do endereço informado e salvas junto
        com a planta no Supabase. A precisão depende dos dados encontrados
        pelo serviço de mapas.
      </p>
    </section>
  );
}
