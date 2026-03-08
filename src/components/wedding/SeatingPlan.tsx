import { useState, useCallback, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { Lock, Settings, Save, X, Plus, Trash2, GripVertical } from "lucide-react";

// ---- Types ----
interface Guest {
  id: string;
  name: string;
}

interface TableData {
  id: string;
  label: string;
  guests: Guest[];
  x: number; // percentage position
  y: number;
}

// ---- Default data ----
const DEFAULT_TABLES: TableData[] = [
  {
    id: "t1", label: "Stół 1", x: 50, y: 15,
    guests: [
      { id: "g1", name: "Rodzice Panny Młodej" },
      { id: "g2", name: "Rodzice Pana Młodego" },
      { id: "g3", name: "Świadkowa" },
      { id: "g4", name: "Świadek" },
    ],
  },
  {
    id: "t2", label: "Stół 2", x: 25, y: 45,
    guests: [
      { id: "g5", name: "Anna & Tomek" },
      { id: "g6", name: "Kasia & Paweł" },
      { id: "g7", name: "Magda & Michał" },
      { id: "g8", name: "Ola & Bartek" },
    ],
  },
  {
    id: "t3", label: "Stół 3", x: 75, y: 45,
    guests: [
      { id: "g9", name: "Marco & Elena" },
      { id: "g10", name: "Luka & Mila" },
      { id: "g11", name: "Stefan & Ana" },
    ],
  },
  {
    id: "t4", label: "Stół 4", x: 25, y: 75,
    guests: [
      { id: "g12", name: "Ewa & Jan" },
      { id: "g13", name: "Zosia & Marek" },
      { id: "g14", name: "Beata & Robert" },
      { id: "g15", name: "Dorota & Adam" },
    ],
  },
  {
    id: "t5", label: "Stół 5", x: 75, y: 75,
    guests: [
      { id: "g16", name: "Piotr & Agata" },
      { id: "g17", name: "Kamil & Natalia" },
      { id: "g18", name: "Łukasz & Weronika" },
    ],
  },
];

const STORAGE_KEY = "wedding_seating_plan";
const ADMIN_PASS = "ADMIN2026";

function loadTables(): TableData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_TABLES;
}

function saveTables(tables: TableData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
}

// ---- Admin password modal ----
const AdminLoginModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useLang();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  if (!open) return null;

  const submit = () => {
    if (pw.trim().toUpperCase() === ADMIN_PASS) {
      onSuccess();
      setPw("");
      setError(false);
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-8 text-center relative max-w-xs w-full">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <Lock className="w-6 h-6 text-wedding-gold mx-auto mb-3" />
        <h3 className="font-serif text-xl font-light mb-4">{t("Tryb admina", "Admin Mode")}</h3>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("Hasło", "Password")}
          className="w-full px-4 py-3 bg-background border border-border font-sans text-sm mb-3 focus:outline-none focus:border-wedding-gold"
        />
        {error && <p className="text-xs text-destructive mb-2">{t("Błędne hasło", "Wrong password")}</p>}
        <button
          onClick={submit}
          className="w-full bg-primary text-primary-foreground py-2.5 font-sans text-xs uppercase tracking-[0.2em]"
        >
          {t("Zaloguj", "Login")}
        </button>
      </div>
    </div>
  );
};

// ---- Round table visual component ----
const TableVisual = ({
  table,
  isAdmin,
  onDragStart,
  onEdit,
  onDelete,
}: {
  table: TableData;
  isAdmin: boolean;
  onDragStart?: (e: React.MouseEvent, id: string) => void;
  onEdit?: (table: TableData) => void;
  onDelete?: (id: string) => void;
}) => {
  const { t } = useLang();
  const guestCount = table.guests.length;
  const radius = Math.max(55, 38 + guestCount * 5);

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
        isAdmin ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
      onMouseDown={isAdmin && onDragStart ? (e) => onDragStart(e, table.id) : undefined}
    >
      {/* Table circle */}
      <div
        className="rounded-full bg-wedding-warm border-2 border-wedding-gold/30 flex items-center justify-center shadow-md relative"
        style={{ width: radius * 2, height: radius * 2 }}
      >
        <div className="text-center">
          <p className="font-serif text-sm font-medium text-foreground leading-tight">{table.label}</p>
          <p className="font-sans text-[10px] text-muted-foreground">{guestCount} {t("os.", "ppl")}</p>
        </div>

        {/* Guest seats around the table */}
        {table.guests.map((guest, i) => {
          const angle = (i / guestCount) * Math.PI * 2 - Math.PI / 2;
          const seatRadius = radius + 22;
          const sx = Math.cos(angle) * seatRadius;
          const sy = Math.sin(angle) * seatRadius;

          return (
            <div
              key={guest.id}
              className="absolute flex items-center justify-center"
              style={{
                left: `calc(50% + ${sx}px)`,
                top: `calc(50% + ${sy}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="bg-card border border-border/60 rounded-full px-2 py-0.5 shadow-sm whitespace-nowrap">
                <span className="font-sans text-[9px] text-foreground">{guest.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(table); }}
            className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shadow"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(table.id); }}
            className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs shadow"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// ---- Table editor modal ----
const TableEditor = ({
  table,
  onSave,
  onClose,
}: {
  table: TableData;
  onSave: (updated: TableData) => void;
  onClose: () => void;
}) => {
  const { t } = useLang();
  const [label, setLabel] = useState(table.label);
  const [guests, setGuests] = useState<Guest[]>([...table.guests]);

  const addGuest = () => {
    setGuests([...guests, { id: `g_${Date.now()}`, name: "" }]);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  const updateGuest = (id: string, name: string) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, name } : g)));
  };

  const handleSave = () => {
    onSave({ ...table, label, guests: guests.filter((g) => g.name.trim()) });
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-8 relative max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-xl font-light mb-5">{t("Edytuj stół", "Edit Table")}</h3>

        <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
          {t("Nazwa stołu", "Table Name")}
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border font-sans text-sm mb-5 focus:outline-none focus:border-wedding-gold"
        />

        <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
          {t("Goście", "Guests")}
        </label>
        <div className="space-y-2 mb-4">
          {guests.map((g) => (
            <div key={g.id} className="flex gap-2">
              <input
                value={g.name}
                onChange={(e) => updateGuest(g.id, e.target.value)}
                placeholder={t("Imię i nazwisko", "Full name")}
                className="flex-1 px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:border-wedding-gold"
              />
              <button
                onClick={() => removeGuest(g.id)}
                className="px-2 text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addGuest}
          className="flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary/80 mb-6"
        >
          <Plus className="w-3.5 h-3.5" /> {t("Dodaj gościa", "Add guest")}
        </button>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground py-2.5 font-sans text-xs uppercase tracking-[0.2em]"
        >
          <Save className="w-3.5 h-3.5 inline mr-2" />
          {t("Zapisz", "Save")}
        </button>
      </div>
    </div>
  );
};

// ---- Main Seating Plan ----
const SeatingPlan = ({ isAdmin: isAdminProp }: { isAdmin?: boolean }) => {
  const { t } = useLang();
  const [tables, setTables] = useState<TableData[]>(loadTables);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);

  const isAdmin = adminMode || !!isAdminProp;

  const handleDragStart = useCallback((e: React.MouseEvent, tableId: string) => {
    if (!isAdmin) return;
    e.preventDefault();
    draggingRef.current = tableId;

    const onMove = (me: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((me.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(5, Math.min(95, ((me.clientY - rect.top) / rect.height) * 100));
      setTables((prev) =>
        prev.map((t) => (t.id === draggingRef.current ? { ...t, x, y } : t))
      );
    };

    const onUp = () => {
      draggingRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setTables((prev) => {
        saveTables(prev);
        return prev;
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isAdmin]);

  const addTable = () => {
    const newTable: TableData = {
      id: `t_${Date.now()}`,
      label: `Stół ${tables.length + 1}`,
      guests: [],
      x: 50,
      y: 50,
    };
    const updated = [...tables, newTable];
    setTables(updated);
    saveTables(updated);
    setEditingTable(newTable);
  };

  const deleteTable = (id: string) => {
    const updated = tables.filter((t) => t.id !== id);
    setTables(updated);
    saveTables(updated);
  };

  const saveEditedTable = (updated: TableData) => {
    const newTables = tables.map((t) => (t.id === updated.id ? updated : t));
    setTables(newTables);
    saveTables(newTables);
    setEditingTable(null);
  };

  return (
    <div>
      {/* Admin toggle */}
      <div className="flex justify-center mb-8">
        {!isAdmin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border border-border/60 px-4 py-2"
          >
            <Settings className="w-3.5 h-3.5" />
            {t("Tryb admina", "Admin Mode")}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-wedding-gold uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              {t("Tryb admina", "Admin Mode")}
            </span>
            <button
              onClick={addTable}
              className="flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> {t("Dodaj stół", "Add Table")}
            </button>
            <button
              onClick={() => setAdminMode(false)}
              className="font-sans text-xs text-muted-foreground hover:text-foreground border border-border/60 px-3 py-1.5"
            >
              {t("Zamknij", "Exit")}
            </button>
          </div>
        )}
      </div>

      {/* Floor plan */}
      <div
        ref={containerRef}
        className="relative w-full bg-wedding-warm/30 border border-border/40 overflow-hidden"
        style={{ aspectRatio: "16 / 10", minHeight: 400 }}
      >
        {/* Dance floor indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
          {t("Parkiet", "Dance Floor")} ↑
        </div>
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border border-dashed border-wedding-gold/20" />

        {tables.map((table) => (
          <TableVisual
            key={table.id}
            table={table}
            isAdmin={isAdmin}
            onDragStart={handleDragStart}
            onEdit={setEditingTable}
            onDelete={deleteTable}
          />
        ))}
      </div>

      {/* Legend */}
      {!isAdmin && (
        <div className="mt-8 text-center">
          <p className="font-sans text-xs text-muted-foreground">
            {t(
              "Kliknij na stół, aby zobaczyć szczegóły. Układ stołów może ulec zmianie.",
              "Click a table to see details. Seating arrangement may change."
            )}
          </p>
        </div>
      )}

      {/* Modals */}
      <AdminLoginModal
        open={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          setAdminMode(true);
          setShowAdminLogin(false);
        }}
      />

      {editingTable && (
        <TableEditor
          table={editingTable}
          onSave={saveEditedTable}
          onClose={() => setEditingTable(null)}
        />
      )}
    </div>
  );
};

export default SeatingPlan;
