# Exception Classification Review

This document contains the 182 low-confidence sites whose shared base classification is `:ex.class/internal`. Application-owned proposals use `:<application>.ex/...` codes and `:<application>.class/...` classes. Greenways products share `:greenways.ex/...` and `:greenways.class/...`. Unresolved sites use `/generic`. Replace the selected code and class fields, add notes where useful, and check each item after review.

## Classification types

- `:ex.class/security` — Authentication, authorization, permission, sandbox, signature, and trust failures.
- `:ex.class/timeout` — Deadlines, timeouts, and operations that did not complete in time.
- `:ex.class/not-found` — Requested files, keys, namespaces, resources, routes, or entities that do not exist.
- `:ex.class/conflict` — Duplicate, already-existing, stale, or mutually conflicting state.
- `:ex.class/limit` — Bounds, capacity, recursion, size, rate, and expansion limits.
- `:ex.class/syntax` — Malformed source, forms, bindings, queries, and parse failures.
- `:ex.class/io` — Filesystem, stream, socket, network, request, and response failures.
- `:ex.class/database` — Database connection, transaction, query, table, and persistence failures.
- `:ex.class/dependency` — Missing or invalid modules, packages, namespaces, services, and dependency graphs.
- `:ex.class/serialization` — Encoding, decoding, EDN, JSON, schema, and wire-format failures.
- `:ex.class/argument` — Invalid caller-supplied values, options, arity, and type constraints.
- `:ex.class/state` — Invalid lifecycle, unavailable capability, and failed operational state.
- `:ex.class/host` — Native process, command, runtime, platform, and host-boundary failures.
- `:ex.class/internal` — Unclassified invariant and implementation failures requiring human review.

## Review queue

## 1. greenways-ai/hestia — `browser/hara/agent_room.hal:241`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/admit-member" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/admit-member`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"invitation is not pending"
```

### Legacy form

```clojure
(ex-info "invitation is not pending"
                        {"invite_id" invite-id
                         "status" (get invite "status")})
```

### Enclosing definition

```clojure
(defn admit-member
  [state data]
  (do
    (require-open state "room/admit")
    (require-true (get data "proof_verified") "proof_verified")
    (require-true (get data "delegation_verified") "delegation_verified")
    (require-true (get data "invite_valid_verified") "invite_valid_verified")
    (require-present (get data "member_id") "member_id")
    (require-present (get data "profile_root") "profile_root")
    (require-present (get data "operational_key") "operational_key")
    (let [invite-id (require-present (get data "invite_id") "invite_id")
          invite (get (get state "invites") invite-id)]
      (require-present invite "invite")
      (if (= "pending" (get invite "status"))
        true
        (throw (ex-info "invitation is not pending"
                        {"invite_id" invite-id
                         "status" (get invite "status")})))
      (let [member-id (get data "member_id")
            epoch (+ 1 (get state "membership_epoch"))
            member {"member_id" member-id
                    "profile_root" (get data "profile_root")
                    "operational_key" (get data "operational_key")
                    "delegation_root" (get data "delegation_root")
                    "role" (get invite "role")
                    "purposes" (or (get invite "purposes") [])
                    "status" "active"
                    "joined_epoch" epoch}
            members (assoc (get state "members") member-id member)
            invites (assoc (get state "invites")
                           invite-id
                           (assoc invite "status" "consumed"))
            record (merge member
                          {"invite_id" invite-id
                           "membership_epoch" epoch})]
        (outcome
         (merge state
                {"members" members
                 "invites" invites
                 "membership_epoch" epoch})
         [(ledger-command "room/member-admitted" record)
          (command "crypto" "rotate-room-epoch"
                   [(get (get state "room") "room_id") epoch])
          (command "transport" "publish-membership" [record])])))))
```

---

## 2. greenways-ai/hestia — `browser/hara/agent_room.hal:306`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/record-work" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/record-work`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"work may only be recorded against an active mandate"
```

### Legacy form

```clojure
(ex-info "work may only be recorded against an active mandate"
                        {"mandate_id" mandate-id
                         "status" (get mandate "status")})
```

### Enclosing definition

```clojure
(defn record-work
  [state data]
  (do
    (require-open state "workflow/record")
    (require-true (get data "member_authorized") "member_authorized")
    (let [mandate-id (require-present (get data "mandate_id") "mandate_id")
          mandate (get (get state "mandates") mandate-id)]
      (require-present mandate "mandate")
      (if (= "active" (get mandate "status"))
        true
        (throw (ex-info "work may only be recorded against an active mandate"
                        {"mandate_id" mandate-id
                         "status" (get mandate "status")})))
      (require-present (get data "step_id") "step_id")
      (require-present (get data "action_root") "action_root")
      (require-present (get data "result_root") "result_root")
      (let [sequence (+ 1 (count (get state "work_log")))
            entry (merge data
                         {"sequence" sequence
                          "membership_epoch" (get state "membership_epoch")})
            work-log (conj (get state "work_log") entry)]
        (outcome
         (assoc state "work_log" work-log)
         [(ledger-command "workflow/work-recorded" entry)])))))
```

---

## 3. greenways-ai/hestia — `browser/hara/agent_room.hal:416`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/counter-offer" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/counter-offer`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"only a proposed offer may be countered"
```

### Legacy form

```clojure
(ex-info "only a proposed offer may be countered"
                        {"offer_id" previous-id
                         "status" (get previous "status")})
```

### Enclosing definition

```clojure
(defn counter-offer
  [state data]
  (do
    (require-open state "negotiation/counter")
    (require-true (get data "member_authorized") "member_authorized")
    (let [previous-id (require-present (get data "supersedes") "supersedes")
          previous (get (get state "offers") previous-id)
          offer-id (require-present (get data "offer_id") "offer_id")]
      (require-present previous "superseded_offer")
      (require-present (get data "offer_root") "offer_root")
      (require-present (get data "terms_root") "terms_root")
      (if (= "proposed" (get previous "status"))
        true
        (throw (ex-info "only a proposed offer may be countered"
                        {"offer_id" previous-id
                         "status" (get previous "status")})))
      (let [offers-with-previous
            (assoc (get state "offers")
                   previous-id
                   (assoc previous "status" "countered"))
            offer (merge data {"status" "proposed"})
            offers (assoc offers-with-previous offer-id offer)]
        (outcome
         (assoc state "offers" offers)
         [(ledger-command "negotiation/offer-countered" offer)
          (command "transport" "deliver-envelope" [offer])])))))
```

---

## 4. greenways-ai/hestia — `browser/hara/agent_room.hal:441`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/accept-offer" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/accept-offer`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"only a proposed offer may be accepted"
```

### Legacy form

```clojure
(ex-info "only a proposed offer may be accepted"
                        {"offer_id" offer-id
                         "status" (get offer "status")})
```

### Enclosing definition

```clojure
(defn accept-offer
  [state data]
  (do
    (require-open state "negotiation/accept")
    (require-true (get data "authority_verified") "authority_verified")
    (let [offer-id (require-present (get data "offer_id") "offer_id")
          offer (get (get state "offers") offer-id)
          room (get state "room")]
      (require-present offer "offer")
      (if (= "proposed" (get offer "status"))
        true
        (throw (ex-info "only a proposed offer may be accepted"
                        {"offer_id" offer-id
                         "status" (get offer "status")})))
      (if (= (get offer "offer_root") (get data "offer_root"))
        true
        (throw (ex-info "acceptance must bind the exact offer root"
                        {"offer_id" offer-id})))
      (if (= "human-required" (get room "acceptance_mode"))
        (require-true (get data "human_approval_verified")
                      "human_approval_verified")
        true)
      (let [accepted (merge offer
                            {"status" "accepted"
                             "accepted_by" (get data "accepted_by")
                             "acceptance_root" (get data "acceptance_root")})
            offers (assoc (get state "offers") offer-id accepted)
            accepted-root (get offer "offer_root")
            record (merge data
                          {"terms_root" (get offer "terms_root")
                           "accepted_offer_root" accepted-root})]
        (outcome
         (merge state
                {"offers" offers
                 "accepted_offer" accepted-root})
         [(ledger-command "negotiation/offer-accepted" record)
          (command "transport" "deliver-envelope" [record])])))))
```

---

## 5. greenways-ai/hestia — `browser/hara/agent_room.hal:446`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/accept-offer" 1]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/accept-offer`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"acceptance must bind the exact offer root"
```

### Legacy form

```clojure
(ex-info "acceptance must bind the exact offer root"
                        {"offer_id" offer-id})
```

### Enclosing definition

```clojure
(defn accept-offer
  [state data]
  (do
    (require-open state "negotiation/accept")
    (require-true (get data "authority_verified") "authority_verified")
    (let [offer-id (require-present (get data "offer_id") "offer_id")
          offer (get (get state "offers") offer-id)
          room (get state "room")]
      (require-present offer "offer")
      (if (= "proposed" (get offer "status"))
        true
        (throw (ex-info "only a proposed offer may be accepted"
                        {"offer_id" offer-id
                         "status" (get offer "status")})))
      (if (= (get offer "offer_root") (get data "offer_root"))
        true
        (throw (ex-info "acceptance must bind the exact offer root"
                        {"offer_id" offer-id})))
      (if (= "human-required" (get room "acceptance_mode"))
        (require-true (get data "human_approval_verified")
                      "human_approval_verified")
        true)
      (let [accepted (merge offer
                            {"status" "accepted"
                             "accepted_by" (get data "accepted_by")
                             "acceptance_root" (get data "acceptance_root")})
            offers (assoc (get state "offers") offer-id accepted)
            accepted-root (get offer "offer_root")
            record (merge data
                          {"terms_root" (get offer "terms_root")
                           "accepted_offer_root" accepted-root})]
        (outcome
         (merge state
                {"offers" offers
                 "accepted_offer" accepted-root})
         [(ledger-command "negotiation/offer-accepted" record)
          (command "transport" "deliver-envelope" [record])])))))
```

---

## 6. greenways-ai/hestia — `browser/hara/agent_room.hal:479`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/complete-mandate" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/complete-mandate`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"only an active mandate may be completed"
```

### Legacy form

```clojure
(ex-info "only an active mandate may be completed"
                        {"mandate_id" mandate-id
                         "status" (get mandate "status")})
```

### Enclosing definition

```clojure
(defn complete-mandate
  [state data]
  (do
    (require-open state "workflow/complete")
    (require-true (get data "authority_verified") "authority_verified")
    (require-true (get data "human_approval_verified") "human_approval_verified")
    (let [mandate-id (require-present (get data "mandate_id") "mandate_id")
          mandate (get (get state "mandates") mandate-id)]
      (require-present mandate "mandate")
      (if (= "active" (get mandate "status"))
        true
        (throw (ex-info "only an active mandate may be completed"
                        {"mandate_id" mandate-id
                         "status" (get mandate "status")})))
      (require-present (get data "completion_root") "completion_root")
      (require-present (get data "receipt_root") "receipt_root")
      (let [completed (merge mandate
                             {"status" "completed"
                              "completion_root" (get data "completion_root")
                              "receipt_root" (get data "receipt_root")})
            mandates (assoc (get state "mandates") mandate-id completed)
            receipt-id (or (get data "receipt_id") mandate-id)
            receipt {"receipt_id" receipt-id
                     "mandate_id" mandate-id
                     "receipt_root" (get data "receipt_root")
                     "status" "private"
                     "completed_epoch" (get state "membership_epoch")}
            receipts (assoc (get state "receipts") receipt-id receipt)]
        (outcome
         (merge state {"mandates" mandates "receipts" receipts})
         [(ledger-command "workflow/mandate-completed" completed)])))))
```

---

## 7. greenways-ai/hestia — `browser/hara/agent_room.hal:510`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/share-receipt" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/share-receipt`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"shared receipt must bind the exact private receipt root"
```

### Legacy form

```clojure
(ex-info "shared receipt must bind the exact private receipt root"
                        {"receipt_id" receipt-id})
```

### Enclosing definition

```clojure
(defn share-receipt
  [state data]
  (do
    (require-open state "receipt/share")
    (require-true (get data "authority_verified") "authority_verified")
    (let [receipt-id (require-present (get data "receipt_id") "receipt_id")
          receipt (get (get state "receipts") receipt-id)]
      (require-present receipt "receipt")
      (if (= (get receipt "receipt_root") (get data "receipt_root"))
        true
        (throw (ex-info "shared receipt must bind the exact private receipt root"
                        {"receipt_id" receipt-id})))
      (require-present (get data "audience") "audience")
      (let [shared (merge receipt
                          {"status" "shared"
                           "audience" (get data "audience")
                           "share_root" (get data "share_root")})
            receipts (assoc (get state "receipts") receipt-id shared)]
        (outcome
         (assoc state "receipts" receipts)
         [(ledger-command "receipt/shared" shared)
          (command "transport" "publish-receipt" [shared])])))))
```

---

## 8. greenways-ai/hestia — `browser/hara/agent_room.hal:563`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/agent_room.hal" "hestia.agent-room/advance" 0]`
- **Role:** `:production`
- **Definition:** `hestia.agent-room/advance`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown agent-room event"
```

### Legacy form

```clojure
(ex-info "unknown agent-room event" {"type" kind})
```

### Enclosing definition

```clojure
(defn advance
  [state event]
  (let [kind (get event "type")
        data (or (get event "data") {})]
    (cond
      (= kind "profile/register") (register-profile state data)
      (= kind "profile/rotate-key") (rotate-profile-key state data)
      (= kind "room/create") (create-room state data)
      (= kind "room/invite") (issue-invite state data)
      (= kind "room/admit") (admit-member state data)
      (= kind "workflow/mandate") (create-mandate state data)
      (= kind "workflow/record") (record-work state data)
      (= kind "room/revoke") (revoke-member state data)
      (= kind "document/attach") (attach-document state data)
      (= kind "message/send") (send-message state data)
      (= kind "negotiation/propose") (propose-offer state data)
      (= kind "negotiation/counter") (counter-offer state data)
      (= kind "negotiation/accept") (accept-offer state data)
      (= kind "workflow/complete") (complete-mandate state data)
      (= kind "receipt/share") (share-receipt state data)
      (= kind "room/close") (close-room state data)
      true
      (throw (ex-info "unknown agent-room event" {"type" kind})))))
```

---

## 9. greenways-ai/hestia — `browser/hara/ceremony.hal:186`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/ceremony.hal" "hestia.ceremony/advance" 0]`
- **Role:** `:production`
- **Definition:** `hestia.ceremony/advance`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown ceremony event"
```

### Legacy form

```clojure
(ex-info "unknown ceremony event" {"type" kind})
```

### Enclosing definition

```clojure
(defn advance
  [state event]
  (let [kind (get event "type")
        data (or (get event "data") {})]
    (cond
      (= kind "ceremony/join")
      (outcome (merge state {"phase" "pairing" "mode" (get data "mode")})
               [(command "persistence" "append-and-save" ["ceremony/joined" data])
                (command "transport" "connect" [])])

      (= kind "invite/invalid")
      (outcome (assoc state "phase" "invalid-invite") [])

      (= kind "transport/connecting")
      (outcome (assoc state "phase" "connecting") [])

      (= kind "transport/connected")
      (outcome (merge state {"connected" true "phase" "connected"})
               [(command "persistence" "save" [])
                (command "transport" "send-peer-state" [false])])

      (= kind "peer/ready")
      (outcome (merge state {"peer_ready" true "phase" "ready"}) [])

      (= kind "peer/state")
      (peer-state-outcome state data)

      (= kind "setup/provision")
      (outcome (assoc state "phase" "provisioning")
               [(command "crypto" "provision" [])])

      (= kind "setup/ready")
      (outcome (assoc state "phase" "ready") [])

      (= kind "recovery/request")
      (do (require-phase state "ready" kind)
          (outcome (assoc state "phase" "requesting")
                   [(command "crypto" "create-request" [])]))

      (= kind "recovery/request-created")
      (outcome (assoc state "pending_request" data)
               [(command "persistence" "append-and-save" ["recovery/requested" data])
                (command "transport" "send-recovery-request" [data])])

      (= kind "recovery/approval-needed")
      (do (require-phase state "ready" kind)
          (outcome (merge state {"phase" "approval" "pending_approval" data})
                   [(command "persistence" "append-and-save"
                             ["recovery/approval-needed" data])]))

      (= kind "recovery/approve")
      (do (require-phase state "approval" kind)
          (outcome (assoc state "phase" "releasing")
                   [(command "crypto" "release-share"
                             [(get state "pending_approval")])]))

      (= kind "recovery/reject")
      (do (require-phase state "approval" kind)
          (outcome (merge state {"phase" "rejected" "pending_approval" nil})
                   [(command "transport" "send-rejection"
                             [(get state "pending_approval")])]))

      (= kind "recovery/share-received")
      (do (require-phase state "requesting" kind)
          (outcome state
                   [(command "crypto" "restore-and-prove"
                             [(get state "pending_request") data])]))

      (= kind "recovery/complete")
      (outcome (merge state {"phase" "complete"
                             "result" "Identity proof verified"
                             "pending_request" nil})
               [])

      (= kind "ceremony/consume")
      (outcome (merge state {"phase" "consumed" "result" nil})
               [(command "persistence" "consume" [data])])

      (= kind "transport/disconnected")
      (outcome (merge state {"connected" false "phase" "disconnected"}) [])

      (= kind "error")
      (outcome (merge state {"phase" "error" "error" (get data "message")}) [])

      true
      (throw (ex-info "unknown ceremony event" {"type" kind})))))
```

---

## 10. greenways-ai/hestia — `browser/hara/document_room.hal:107`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/document_room.hal" "hestia.document-room/advance" 0]`
- **Role:** `:production`
- **Definition:** `hestia.document-room/advance`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"only the room sequencer may admit batches"
```

### Legacy form

```clojure
(ex-info "only the room sequencer may admit batches" {})
```

### Enclosing definition

```clojure
(defn advance
  [state event]
  (let [kind (get event "type")
        data (or (get event "data") {})]
    (cond
      (= kind "room/start")
      (outcome state [(command "transport" "connect" [])])

      (= kind "transport/connecting")
      (outcome (assoc state "phase" "connecting") [])

      (= kind "transport/connected")
      (outcome (merge state {"phase" "joining" "connected" true})
               [(command "transport" "send-join" [])])

      (= kind "peer/joined")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "peer_id" (get data "peer_id"))
                 [(command "room" "issue-genesis" [data])])
        (outcome (assoc state "peer_id" (get data "peer_id")) []))

      (= kind "room/genesis-accepted")
      (outcome (merge state
                      {"phase" "active"
                       "epoch" (get data "epoch")
                       "revision" (get data "revision")
                       "head_root" (get data "head_root")})
               [])

      (= kind "edit/submit")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "phase" "sequencing")
                 [(command "document" "sequence-local-batch" [data])])
        (outcome (assoc state "pending_batches"
                        (+ 1 (get state "pending_batches")))
                 [(command "document" "sign-and-send-batch" [data])]))

      (= kind "batch/received")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "phase" "sequencing")
                 [(command "document" "sequence-remote-batch" [data])])
        (throw (ex-info "only the room sequencer may admit batches" {})))

      (= kind "commit/received")
      (outcome (assoc state "phase" "verifying")
               [(command "document" "verify-commit" [data])])

      (= kind "revision/applied")
      (outcome (merge state
                      {"phase" (if (= (get data "outcome") "conflict")
                                 "conflict"
                                 "active")
                       "revision" (get data "revision")
                       "head_root" (get data "head_root")
                       "pending_batches" (max 0 (- (get state "pending_batches") 1))
                       "last_outcome" (get data "outcome")})
               [])

      (= kind "transport/disconnected")
      (outcome (merge state {"phase" "disconnected" "connected" false}) [])

      (= kind "error")
      (outcome (merge state {"phase" "error" "error" (get data "message")}) [])

      true
      (throw (ex-info "unknown document room event" {"type" kind})))))
```

---

## 11. greenways-ai/hestia — `browser/hara/document_room.hal:131`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/document_room.hal" "hestia.document-room/advance" 1]`
- **Role:** `:production`
- **Definition:** `hestia.document-room/advance`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown document room event"
```

### Legacy form

```clojure
(ex-info "unknown document room event" {"type" kind})
```

### Enclosing definition

```clojure
(defn advance
  [state event]
  (let [kind (get event "type")
        data (or (get event "data") {})]
    (cond
      (= kind "room/start")
      (outcome state [(command "transport" "connect" [])])

      (= kind "transport/connecting")
      (outcome (assoc state "phase" "connecting") [])

      (= kind "transport/connected")
      (outcome (merge state {"phase" "joining" "connected" true})
               [(command "transport" "send-join" [])])

      (= kind "peer/joined")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "peer_id" (get data "peer_id"))
                 [(command "room" "issue-genesis" [data])])
        (outcome (assoc state "peer_id" (get data "peer_id")) []))

      (= kind "room/genesis-accepted")
      (outcome (merge state
                      {"phase" "active"
                       "epoch" (get data "epoch")
                       "revision" (get data "revision")
                       "head_root" (get data "head_root")})
               [])

      (= kind "edit/submit")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "phase" "sequencing")
                 [(command "document" "sequence-local-batch" [data])])
        (outcome (assoc state "pending_batches"
                        (+ 1 (get state "pending_batches")))
                 [(command "document" "sign-and-send-batch" [data])]))

      (= kind "batch/received")
      (if (= (get state "role") "sequencer")
        (outcome (assoc state "phase" "sequencing")
                 [(command "document" "sequence-remote-batch" [data])])
        (throw (ex-info "only the room sequencer may admit batches" {})))

      (= kind "commit/received")
      (outcome (assoc state "phase" "verifying")
               [(command "document" "verify-commit" [data])])

      (= kind "revision/applied")
      (outcome (merge state
                      {"phase" (if (= (get data "outcome") "conflict")
                                 "conflict"
                                 "active")
                       "revision" (get data "revision")
                       "head_root" (get data "head_root")
                       "pending_batches" (max 0 (- (get state "pending_batches") 1))
                       "last_outcome" (get data "outcome")})
               [])

      (= kind "transport/disconnected")
      (outcome (merge state {"phase" "disconnected" "connected" false}) [])

      (= kind "error")
      (outcome (merge state {"phase" "error" "error" (get data "message")}) [])

      true
      (throw (ex-info "unknown document room event" {"type" kind})))))
```

---

## 12. greenways-ai/hestia — `browser/hara/document_room.hal:184`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/document_room.hal" "hestia.document-room/canonical-operation" 0]`
- **Role:** `:production`
- **Definition:** `hestia.document-room/canonical-operation`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unsupported browser document operation"
```

### Legacy form

```clojure
(ex-info "unsupported browser document operation"
                      {"type" kind})
```

### Enclosing definition

```clojure
(defn canonical-operation
  [operation]
  (let [kind (get operation "type")
        common (canonical-common operation)]
    (cond
      (= kind "operation.noop")
      (merge common {:noop-reason (get operation "noopReason")})

      (= kind "text.splice")
      (merge common
             {:target-id (get operation "targetId")
              :offset (get operation "offset")
              :delete-count (or (get operation "deleteCount") 0)
              :insert (or (get operation "insert") "")})

      (= kind "node.insert")
      (merge common
             {:parent-id (get operation "parentId")
              :before-id (get operation "beforeId")
              :after-id (get operation "afterId")
              :node (get operation "node")})

      (= kind "node.delete")
      (merge common
             {:target-id (get operation "targetId")
              :expected-root (get operation "expectedRoot")})

      (= kind "node.set-attrs")
      (merge common
             {:target-id (get operation "targetId")
              :expected-attrs (get operation "expectedAttrs")
              :attrs (get operation "attrs")})

      (= kind "artefact.commit")
      (merge common
             {:artefact-id (get operation "artefactId")
              :artefact-node-id (get operation "artefactNodeId")
              :source-text-id (get operation "sourceTextId")
              :source-root (get operation "sourceRoot")
              :result-root (get operation "resultRoot")
              :media-type (get operation "mediaType")
              :display (get operation "display")})

      true
      (throw (ex-info "unsupported browser document operation"
                      {"type" kind})))))
```

---

## 13. greenways-ai/hestia — `browser/hara/document_room.hal:245`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/document_room.hal" "hestia.document-room/project-operation" 0]`
- **Role:** `:production`
- **Definition:** `hestia.document-room/project-operation`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unsupported canonical document operation"
```

### Legacy form

```clojure
(ex-info "unsupported canonical document operation"
                      {:type kind})
```

### Enclosing definition

```clojure
(defn project-operation
  [operation]
  (let [kind (get operation :type)
        common (project-common operation)]
    (cond
      (= kind "operation.noop")
      (merge common {"noopReason" (get operation :noop-reason)})

      (= kind "text.splice")
      (merge common
             {"targetId" (get operation :target-id)
              "offset" (get operation :offset)
              "deleteCount" (get operation :delete-count)
              "insert" (get operation :insert)})

      (= kind "node.insert")
      (merge common
             {"parentId" (get operation :parent-id)
              "beforeId" (get operation :before-id)
              "afterId" (get operation :after-id)
              "node" (get operation :node)})

      (= kind "node.delete")
      (merge common
             {"targetId" (get operation :target-id)
              "expectedRoot" (get operation :expected-root)})

      (= kind "node.set-attrs")
      (merge common
             {"targetId" (get operation :target-id)
              "expectedAttrs" (get operation :expected-attrs)
              "attrs" (get operation :attrs)})

      (= kind "artefact.commit")
      (merge common
             {"artefactId" (get operation :artefact-id)
              "artefactNodeId" (get operation :artefact-node-id)
              "sourceTextId" (get operation :source-text-id)
              "sourceRoot" (get operation :source-root)
              "resultRoot" (get operation :result-root)
              "mediaType" (get operation :media-type)
              "display" (get operation :display)})

      true
      (throw (ex-info "unsupported canonical document operation"
                      {:type kind})))))
```

---

## 14. greenways-ai/hestia — `browser/hara/shamir.hal:39`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/shamir.hal" "std.crypto.shamir/gf-inverse" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/gf-inverse`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"cannot invert zero in GF(256)"
```

### Legacy form

```clojure
(ex-info "cannot invert zero in GF(256)" {:value value})
```

### Enclosing definition

```clojure
(defn gf-inverse
  [value]
  (if (= value 0)
    (throw (ex-info "cannot invert zero in GF(256)" {:value value}))
    (gf-power value 254)))
```

---

## 15. greenways-ai/hestia — `browser/hara/shamir.hal:77`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/shamir.hal" "std.crypto.shamir/validate-split" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/validate-split`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"secret must not be empty"
```

### Legacy form

```clojure
(ex-info "secret must not be empty" {})
```

### Enclosing definition

```clojure
(defn validate-split
  [secret shares threshold coefficient-bytes]
  (let [length (std.native.Bytes/count secret)
        expected (* length (- threshold 1))]
    (if (= length 0)
      (throw (ex-info "secret must not be empty" {}))
      nil)
    (if (or (< threshold 2) (> threshold 255))
      (throw (ex-info "invalid threshold" {:threshold threshold}))
      nil)
    (if (or (< shares threshold) (> shares 255))
      (throw (ex-info "invalid share count" {:shares shares}))
      nil)
    (if (not (= expected (std.native.Bytes/count coefficient-bytes)))
      (throw (ex-info "invalid coefficient byte count"
                      {:expected expected
                       :actual (std.native.Bytes/count coefficient-bytes)}))
      nil)
    true))
```

---

## 16. greenways-ai/hestia — `browser/hara/shamir.hal:97`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/shamir.hal" "std.crypto.shamir/entropy-byte-count" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/entropy-byte-count`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"secret must not be empty"
```

### Legacy form

```clojure
(ex-info "secret must not be empty" {})
```

### Enclosing definition

```clojure
(defn entropy-byte-count
  "Returns the exact entropy requested from the crypto.random capability."
  [secret shares threshold]
  (let [length (std.native.Bytes/count secret)]
    (if (= length 0)
      (throw (ex-info "secret must not be empty" {}))
      nil)
    (if (or (< threshold 2) (> threshold 255))
      (throw (ex-info "invalid threshold" {:threshold threshold}))
      nil)
    (if (or (< shares threshold) (> shares 255))
      (throw (ex-info "invalid share count" {:shares shares}))
      nil)
    (* length (- threshold 1))))
```

---

## 17. greenways-ai/hestia — `browser/hara/shamir.hal:172`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/shamir.hal" "std.crypto.shamir/validate-shares" 2]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/validate-shares`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"inconsistent shares"
```

### Legacy form

```clojure
(ex-info "inconsistent shares" {:index index})
```

### Enclosing definition

```clojure
(defn validate-shares
  [shares]
  (if (< (count shares) 2)
    (throw (ex-info "at least two shares required" {}))
    nil)
  (let [length (std.native.Bytes/count (nth shares 0))
        indexes (indexes-of shares)]
    (if (< length 2)
      (throw (ex-info "invalid share length" {:length length}))
      nil)
    (loop [index 0]
      (if (< index (count shares))
        (let [share (nth shares index)
              share-index (nth indexes index)]
          (if (not (= length (std.native.Bytes/count share)))
            (throw (ex-info "inconsistent shares" {:index index}))
            nil)
          (if (or (= share-index 0)
                  (contains-index? indexes share-index index))
            (throw (ex-info "invalid or duplicate share indexes"
                            {:index share-index}))
            nil)
          (recur (inc index)))
        nil))
    indexes))
```

---

## 18. greenways-ai/hestia — `browser/hara/workflow_v3.hal:133`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "browser/hara/workflow_v3.hal" "hestia.workflow-v3/advance" 1]`
- **Role:** `:production`
- **Definition:** `hestia.workflow-v3/advance`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown v3 event"
```

### Legacy form

```clojure
(ex-info "unknown v3 event" {"type" kind})
```

### Enclosing definition

```clojure
(defn advance [state event]
  (let [kind (get event "type") data (or (get event "data") {})]
    (cond
      (= kind "scenario/select")
      (let [selected (scenario (get data "scenario"))]
        (outcome (merge state {"phase" "select-authorities" "scenario" selected
                               "authorities" []}) []))
      (= kind "authorities/select")
      (let [chosen (get data "authorities")]
        (if (= 3 (count chosen))
          (outcome (merge state {"phase" "explain-enrollment" "authorities" chosen}) [])
          (throw (ex-info "select exactly three authorities" {"count" (count chosen)}))))
      (= kind "identity/create")
      (outcome (assoc state "phase" "creating-identity")
               [(command "crypto" "create-v3-identity" [])])
      (= kind "identity/created")
      (outcome (merge state {"phase" "save-recovery-code" "identity" data}) [])
      (= kind "factor/secured")
      (outcome (merge state {"phase" "enrollment" "factor_saved" true})
               [(command "crypto" "split-authority-secret" [])])
      (= kind "education/enrollment-start")
      (outcome (assoc state "enrollment_step" 0) [])
      (= kind "education/enrollment-next")
      (let [current (get state "enrollment_step")]
        (outcome (assoc state "enrollment_step" (if (< current 9) (+ current 1) 9)) []))
      (= kind "identity/lost")
      (outcome (merge state {"phase" "lost" "lost" true})
               [(command "crypto" "forget-active-identity" [])])
      (= kind "recovery/start")
      (outcome (assoc state "phase" "collecting-approvals") [])
      (= kind "authority/approved")
      (let [approvals (conj (get state "approvals") (get data "authority"))]
        (outcome (merge state {"approvals" approvals
                               "phase" (if (>= (count approvals) 2)
                                         "enter-recovery-code"
                                         "collecting-approvals")}) []))
      (= kind "recovery/code-entered")
      (outcome (assoc state "phase" "recovering")
               [(command "crypto" "recover-v3-identity" [data])])
      (= kind "education/recovery-start")
      (outcome (assoc state "recovery_step" 0) [])
      (= kind "education/recovery-next")
      (let [current (get state "recovery_step")]
        (outcome (assoc state "recovery_step" (if (< current 7) (+ current 1) 7)) []))
      (= kind "recovery/complete")
      (outcome (merge state {"phase" "recovered" "lost" false}) [])
      (= kind "chat/message")
      (outcome (assoc state "chat" (conj (get state "chat") data))
               [(command "transport" "send-chat" [data])])
      true (throw (ex-info "unknown v3 event" {"type" kind})))))
```

---

## 19. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/agent_room.hal:90`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/agent_room.hal" "gw.ledger.agent-room/field-names" 0]`
- **Role:** `:production`
- **Definition:** `gw.ledger.agent-room/field-names`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown Hestia agent-room record kind"
```

### Legacy form

```clojure
(ex-info "unknown Hestia agent-room record kind" {"kind" kind})
```

### Enclosing definition

```clojure
(defn field-names
  "Returns the normative field order for one Hestia agent-room record. Every
   field value is an HCV0 root; optional values use the canonical nil root."
  [kind]
  (cond
    (= kind "profile/version")
    ["profile-id" "sequence" "previous-profile" "name" "profile-kind"
     "root-key" "operational-key" "delegation"]

    (= kind "profile/key-delegation")
    ["delegation-id" "issuer-profile" "issuer-key" "subject-key"
     "subject-public-key" "purposes" "scope" "valid-from" "valid-until"
     "revocation"]

    (= kind "profile/state")
    ["profile-id" "sequence" "profile-version" "root-key" "operational-key"
     "delegation" "status"]

    (= kind "room/version")
    ["room-id" "sequence" "previous-room" "host-profile" "policy" "kernel"
     "acceptance-mode"]

    (= kind "room/invitation")
    ["invite-id" "room" "host-profile-id" "host-profile" "role" "purposes"
     "expires-at" "capability-commitment" "one-time"]

    (= kind "room/admission-proof")
    ["proof-id" "invitation" "invite-id" "room" "guest-profile-id"
     "guest-profile" "guest-key" "capability-proof"]

    (= kind "room/membership")
    ["room" "member-profile" "role" "purposes" "status" "joined-epoch"
     "revoked-epoch" "delegation"]

    (= kind "room/member-state")
    ["room" "member-profile" "role" "purposes" "status" "joined-epoch"
     "revoked-epoch" "delegation"]

    (= kind "room/invitation-state")
    ["invitation" "room-state" "status" "consumed-by" "consumed-record"]

    (= kind "room/state")
    ["room-id" "room-version" "host-profile" "membership-epoch" "members"
     "invitations" "policy" "kernel" "acceptance-mode" "status"]

    (= kind "room/activity-state")
    ["room-state" "previous-activity" "event" "activity-kind"
     "actor-profile" "membership-epoch" "sequence"]

    (= kind "room/message")
    ["message-id" "room" "membership-epoch" "sender-profile" "sent-at" "iv"
     "ciphertext" "ciphertext-root"]

    (= kind "room/message-intent")
    ["room" "membership-epoch" "sender-profile" "envelope" "ciphertext"
     "delivery-policy"]

    (= kind "document/version")
    ["document-id" "version" "previous-version" "content" "media-type"
     "author-profile" "created-at"]

    (= kind "room/document-attachment")
    ["room" "document" "document-policy" "attached-by"]

    (= kind "negotiation/offer")
    ["offer-id" "room" "terms" "offered-by" "supersedes" "valid-until"
     "authority"]

    (= kind "negotiation/acceptance")
    ["offer" "accepted-by" "human-approval" "accepted-at" "authority"]

    (= kind "ledger/signed-record")
    ["body" "signer-key" "signature"]

    (= kind "ledger/verification-receipt")
    ["record" "body" "signer-key" "environment-key" "outcome" "sequence"]

    (= kind "ledger/admission-receipt")
    ["previous-state" "event" "policy" "kernel" "result-state" "effect-plan"
     "record" "outcome" "sequence"]

    true
    (throw (ex-info "unknown Hestia agent-room record kind" {"kind" kind}))))
```

---

## 20. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/document_ot.hal:58`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/document_ot.hal" "gw.ledger.document-ot/record-fields" 0]`
- **Role:** `:production`
- **Definition:** `gw.ledger.document-ot/record-fields`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"unknown document ledger record kind"
```

### Legacy form

```clojure
(ex-info "unknown document ledger record kind" {"kind" kind})
```

### Enclosing definition

```clojure
(defn record-fields
  "Returns the canonical HCV0 role order for signed document records."
  [kind]
  (cond
    (= kind "document/text-splice")
    ["operation-id" "document-id" "target" "offset" "delete-count" "insert"
     "base-revision"]

    (= kind "document/node-insert")
    ["operation-id" "document-id" "parent" "before" "after" "node"
     "base-revision"]

    (= kind "document/node-delete")
    ["operation-id" "document-id" "target" "expected" "base-revision"]

    (= kind "document/node-set-attrs")
    ["operation-id" "document-id" "target" "expected-attrs" "attrs"
     "base-revision"]

    (= kind "document/artefact-commit")
    ["operation-id" "document-id" "artefact-id" "artefact-node" "source-text"
     "source" "result" "media-type" "display" "base-revision"]

    (= kind "document/batch")
    ["batch-id" "document-id" "base-revision" "base-ast" "operations"
     "expected-result" "author-profile" "delegation"]

    (= kind "document/transformation")
    ["transformation-id" "document-id" "batch" "base-revision"
     "previous-revision" "previous-ast" "transformed-operations" "result-ast"
     "outcome" "conflict"]

    (= kind "document/revision")
    ["document-id" "revision" "previous-revision" "previous-ast" "batch"
     "transformation" "transformed-operations" "result-ast" "author-profile"
     "environment-key"]

    (= kind "document/import-receipt")
    ["document-id" "batch" "transformation" "base-revision"
     "previous-revision" "transformed-operations" "result-revision"
     "result-ast" "outcome" "sequence"]

    (= kind "document/verification-receipt")
    ["record" "body" "signer-key" "environment-key" "outcome" "sequence"]

    (= kind "document/signed-record")
    ["body" "signer-key" "signature"]

    true
    (throw (ex-info "unknown document ledger record kind" {"kind" kind}))))
```

---

## 21. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/document_ot.hal:127`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/document_ot.hal" "gw.ledger.document-ot/transform-text-splice" 0]`
- **Role:** `:production`
- **Definition:** `gw.ledger.document-ot/transform-text-splice`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"insertion falls inside accepted deleted text"
```

### Legacy form

```clojure
(ex-info "insertion falls inside accepted deleted text"
                        {:code :text.insert-inside-deleted-range
                         :incoming incoming
                         :accepted accepted})
```

### Enclosing definition

```clojure
(defn transform-text-splice
  [scalar-count incoming accepted]
  (if (not (= (get incoming :target-id) (get accepted :target-id)))
    incoming
    (let [accepted-start (get accepted :offset)
          accepted-delete (get accepted :delete-count)
          accepted-end (+ accepted-start accepted-delete)
          incoming-start (get incoming :offset)
          incoming-delete (get incoming :delete-count)
          incoming-end (+ incoming-start incoming-delete)
          incoming-insert (inserted-length scalar-count incoming)]
      (cond
        (and (> accepted-delete 0)
             (> incoming-insert 0)
             (= incoming-delete 0)
             (> incoming-start accepted-start)
             (< incoming-start accepted-end))
        (throw (ex-info "insertion falls inside accepted deleted text"
                        {:code :text.insert-inside-deleted-range
                         :incoming incoming
                         :accepted accepted}))

        (and (= accepted-delete 0)
             (= incoming-delete 0)
             (= incoming-start accepted-start))
        (assoc incoming :offset
               (+ incoming-start (inserted-length scalar-count accepted)))

        true
        (let [start (map-position scalar-count incoming-start accepted 1)
              end (map-position scalar-count incoming-end accepted 1)
              next (assoc (assoc incoming :offset (lower-number start end))
                          :delete-count (upper-number 0 (- end start)))]
          (if (and (= (get next :delete-count) 0)
                   (= (inserted-length scalar-count next) 0))
            (noop next "overlapping deletion already accepted")
            next))))))
```

---

## 22. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/document_ot.hal:164`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/document_ot.hal" "gw.ledger.document-ot/transform-node-operation" 0]`
- **Role:** `:production`
- **Definition:** `gw.ledger.document-ot/transform-node-operation`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"operation targets a deleted node"
```

### Legacy form

```clojure
(ex-info "operation targets a deleted node"
                    {:code :node.target-deleted
                     :incoming incoming
                     :accepted accepted})
```

### Enclosing definition

```clojure
(defn transform-node-operation
  [incoming accepted]
  (cond
    (and (= (get accepted :type) "node.delete")
         (= (get incoming :type) "node.delete")
         (= (get incoming :target-id) (get accepted :target-id)))
    (noop incoming "target already deleted")

    (and (= (get accepted :type) "node.delete")
         (targets-deleted-node? incoming (get accepted :target-id)))
    (throw (ex-info "operation targets a deleted node"
                    {:code :node.target-deleted
                     :incoming incoming
                     :accepted accepted}))

    true incoming))
```

---

## 23. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/document_ot.hal:176`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/document_ot.hal" "gw.ledger.document-ot/transform-artefact-commit" 0]`
- **Role:** `:production`
- **Definition:** `gw.ledger.document-ot/transform-artefact-commit`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"artefact was deleted before snapshot admission"
```

### Legacy form

```clojure
(ex-info "artefact was deleted before snapshot admission"
                    {:code :artefact.deleted})
```

### Enclosing definition

```clojure
(defn transform-artefact-commit
  [incoming accepted]
  (cond
    (and (= (get accepted :type) "node.delete")
         (= (get incoming :artefact-node-id) (get accepted :target-id)))
    (throw (ex-info "artefact was deleted before snapshot admission"
                    {:code :artefact.deleted}))

    (and (= (get accepted :type) "text.splice")
         (= (get incoming :source-text-id) (get accepted :target-id)))
    (throw (ex-info "artefact source changed after the batch base"
                    {:code :artefact.source-changed}))

    (and (= (get accepted :type) "artefact.commit")
         (= (get incoming :artefact-id) (get accepted :artefact-id))
         (= (get incoming :source-root) (get accepted :source-root))
         (= (get incoming :result-root) (get accepted :result-root)))
    (noop incoming "identical artefact result already committed")

    (and (= (get accepted :type) "artefact.commit")
         (= (get incoming :artefact-id) (get accepted :artefact-id)))
    (throw (ex-info "competing artefact results"
                    {:code :artefact.result-conflict}))

    true incoming))
```

---

## 24. greenways-ai/hestia — `gwdb-ledger-hal/src/gw/ledger/document_ot.hal:181`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/hestia" "gwdb-ledger-hal/src/gw/ledger/document_ot.hal" "gw.ledger.document-ot/transform-artefact-commit" 1]`
- **Role:** `:production`
- **Definition:** `gw.ledger.document-ot/transform-artefact-commit`
- **Legacy code:** `—`
- **Proposed code:** `:hestia.ex/generic`
- **Proposed class:** `:hestia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:hestia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"artefact source changed after the batch base"
```

### Legacy form

```clojure
(ex-info "artefact source changed after the batch base"
                    {:code :artefact.source-changed})
```

### Enclosing definition

```clojure
(defn transform-artefact-commit
  [incoming accepted]
  (cond
    (and (= (get accepted :type) "node.delete")
         (= (get incoming :artefact-node-id) (get accepted :target-id)))
    (throw (ex-info "artefact was deleted before snapshot admission"
                    {:code :artefact.deleted}))

    (and (= (get accepted :type) "text.splice")
         (= (get incoming :source-text-id) (get accepted :target-id)))
    (throw (ex-info "artefact source changed after the batch base"
                    {:code :artefact.source-changed}))

    (and (= (get accepted :type) "artefact.commit")
         (= (get incoming :artefact-id) (get accepted :artefact-id))
         (= (get incoming :source-root) (get accepted :source-root))
         (= (get incoming :result-root) (get accepted :result-root)))
    (noop incoming "identical artefact result already committed")

    (and (= (get accepted :type) "artefact.commit")
         (= (get incoming :artefact-id) (get accepted :artefact-id)))
    (throw (ex-info "competing artefact results"
                    {:code :artefact.result-conflict}))

    true incoming))
```

---

## 25. greenways-ai/historia — `src-hara/historia/vault.hal:41`

- [ ] Reviewed
- **Site ID:** `["greenways-ai/historia" "src-hara/historia/vault.hal" "historia.vault/init" 0]`
- **Role:** `:production`
- **Definition:** `historia.vault/init`
- **Legacy code:** `—`
- **Proposed code:** `:historia.ex/generic`
- **Proposed class:** `:historia.class/generic`
- **Shared base class:** `:ex.class/internal`
- **Application:** `:historia`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Historia vault is not a bare Git repository"
```

### Legacy form

```clojure
(ex-info "Historia vault is not a bare Git repository" {:vault vault})
```

### Enclosing definition

```clojure
(defn init
  [provided]
  (let [vault (path/vault-path provided)]
    (if (initialized? vault)
      nil
      (process/run! ["git" "init" "--bare" vault]))
    (let [bare (str/trim (:stdout (git-run! vault ["rev-parse" "--is-bare-repository"])))
          object-format (str/trim (:stdout (git-run! vault ["rev-parse" "--show-object-format"])))]
      (if (= bare "true")
        {"vault" vault
         "objectFormat" (if (str/blank? object-format) "sha1" object-format)}
        (throw (ex-info "Historia vault is not a bare Git repository" {:vault vault}))))))
```

---

## 26. hara-lang/hara — `core/lib/src-lang/xt/lang/common_repl.hal:183`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src-lang/xt/lang/common_repl.hal" "xt.lang.common-repl/notify" 0]`
- **Role:** `:production`
- **Definition:** `xt.lang.common-repl/notify`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No ID for Notify"
```

### Legacy form

```clojure
(ex-info "No ID for Notify" {})
```

### Enclosing definition

```clojure
(defmacro.xt ^{:standalone true}
  notify
  "sends a message to the notify server"
  {:added "4.0"}
  [value & [id tag]]
  (notify-form (or id
                   notify/*override-id*
                   (throw (ex-info "No ID for Notify" {})))
               value {:tag tag}))
```

---

## 27. hara-lang/hara — `core/lib/src/code/manage/cli.hal:220`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/manage/cli.hal" "code.manage.cli/translation-project" 0]`
- **Role:** `:production`
- **Definition:** `code.manage.cli/translation-project`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"clojure-to-hal --to must name a Hara repository or project"
```

### Legacy form

```clojure
(ex-info "clojure-to-hal --to must name a Hara repository or project"
                            {:target/root target-root})
```

### Enclosing definition

```clojure
(defn translation-project [target-root]
  (let [direct (File/join target-root "project.edn")
        nested-root (File/join target-root "core")
        nested (File/join nested-root "project.edn")]
    (cond
      (deref (File/exists? direct)) {:project/root target-root}
      (deref (File/exists? nested)) {:project/root nested-root}
      :else (throw (ex-info "clojure-to-hal --to must name a Hara repository or project"
                            {:target/root target-root})))))
```

---

## 28. hara-lang/hara — `core/lib/src/code/manage/unit/template.hal:70`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/manage/unit/template.hal" "code.manage.unit.template/invoke-tasklet" 0]`
- **Role:** `:production`
- **Definition:** `code.manage.unit.template/invoke-tasklet`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"code.manage tasklets support one or two arguments"
```

### Legacy form

```clojure
(ex-info
      "code.manage tasklets support one or two arguments"
      {:argcount argcount})
```

### Enclosing definition

```clojure
(defn invoke-tasklet
  [tasklet argcount unit options]
  (case argcount
    1 (tasklet unit)
    2 (tasklet unit options)
    (throw
     (ex-info
      "code.manage tasklets support one or two arguments"
      {:argcount argcount}))))
```

---

## 29. hara-lang/hara — `core/lib/src/code/manage/unit/test_doc.hal:401`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/manage/unit/test_doc.hal" "code.manage.unit.test-doc/render-fact" 0]`
- **Role:** `:production`
- **Definition:** `code.manage.unit.test-doc/render-fact`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"cannot render an unresolved test fact"
```

### Legacy form

```clojure
(ex-info "cannot render an unresolved test fact" {:fact fact})
```

### Enclosing definition

```clojure
(defn render-fact
  [fact]
  (if (nil? (:refer fact))
    (throw (ex-info "cannot render an unresolved test fact" {:fact fact}))
    (str "^" (pr-str (normalized-meta fact)) "\n" (:source fact))))
```

---

## 30. hara-lang/hara — `core/lib/src/code/migrate.hal:1575`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/migrate.hal" "code.migrate/apply" 0]`
- **Role:** `:production`
- **Definition:** `code.migrate/apply`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Migration contains blocking diagnostics"
```

### Legacy form

```clojure
(ex-info "Migration contains blocking diagnostics"
                      {:diagnostics diagnostics})
```

### Enclosing definition

```clojure
(defn apply
  [root plan]
  (let [edits (vec (owned-edits (planned-edits plan)))
        diagnostics
        (vec (mapcat (fn [unit] (:diagnostics unit)) edits))]
    (if (not (empty? diagnostics))
      (throw (ex-info "Migration contains blocking diagnostics"
                      {:diagnostics diagnostics})))
    (vec (map (fn [unit] (validate-unit root unit)) edits))
    (vec (map (fn [unit] (apply-unit root unit)) edits))))
```

---

## 31. hara-lang/hara — `core/lib/src/code/query/compile.hal:33`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/query/compile.hal" "code.query.compile/cursor-info" 0]`
- **Role:** `:production`
- **Definition:** `code.query.compile/cursor-info`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Form should be in the last position of the selectors"
```

### Legacy form

```clojure
(ex-info "Form should be in the last position of the selectors" {})
```

### Enclosing definition

```clojure
(defn cursor-info
  "finds the information related to the cursor\n \n   (cursor-info '[(defn ^:?& _ | & _)])\n   => '[0 :form (defn _ | & _)]\n \n   (cursor-info (expand-all-metas '[(defn ^:?& _ | & _)]))\n   => '[0 :form (defn _ | & _)]\n \n   (cursor-info '[defn if])\n   => [nil :cursor]\n \n   (cursor-info '[defn | if])\n   => [1 :cursor]"
  {:added "3.0"}
  [selectors]
  (let [candidates (keep
                    identity
                    (map-indexed
                     (fn
                      [i ele]
                      (cond
                       (= ele (quote |))
                       [i :cursor]
                       (and (form? ele) (not= (common/prepare-query ele) ele))
                       [i :form ele]))
                     selectors))]
    (case (count candidates)
      0
      (if (form? (last selectors))
        [(dec (count selectors)) :form (last selectors)]
        [nil :cursor])
      1
      (let [max         (dec (count selectors))
            [i
             type
             :as
             candidate] (first candidates)
            _           (case
                         type                                                                                       :form
                         (if
                          (not= i max) (throw (ex-info "Form should be in the last position of the selectors" {}))) :cursor
                         (if
                          (= i max) (throw (ex-info "Cursor cannot be in the last position of the selectors" {}))))]
        candidate)
      (throw (ex-info (format "There should only be one of %s in the path.")
               {:candidates candidates})))))
```

---

## 32. hara-lang/hara — `core/lib/src/code/query/compile.hal:35`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/query/compile.hal" "code.query.compile/cursor-info" 1]`
- **Role:** `:production`
- **Definition:** `code.query.compile/cursor-info`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cursor cannot be in the last position of the selectors"
```

### Legacy form

```clojure
(ex-info "Cursor cannot be in the last position of the selectors" {})
```

### Enclosing definition

```clojure
(defn cursor-info
  "finds the information related to the cursor\n \n   (cursor-info '[(defn ^:?& _ | & _)])\n   => '[0 :form (defn _ | & _)]\n \n   (cursor-info (expand-all-metas '[(defn ^:?& _ | & _)]))\n   => '[0 :form (defn _ | & _)]\n \n   (cursor-info '[defn if])\n   => [nil :cursor]\n \n   (cursor-info '[defn | if])\n   => [1 :cursor]"
  {:added "3.0"}
  [selectors]
  (let [candidates (keep
                    identity
                    (map-indexed
                     (fn
                      [i ele]
                      (cond
                       (= ele (quote |))
                       [i :cursor]
                       (and (form? ele) (not= (common/prepare-query ele) ele))
                       [i :form ele]))
                     selectors))]
    (case (count candidates)
      0
      (if (form? (last selectors))
        [(dec (count selectors)) :form (last selectors)]
        [nil :cursor])
      1
      (let [max         (dec (count selectors))
            [i
             type
             :as
             candidate] (first candidates)
            _           (case
                         type                                                                                       :form
                         (if
                          (not= i max) (throw (ex-info "Form should be in the last position of the selectors" {}))) :cursor
                         (if
                          (= i max) (throw (ex-info "Cursor cannot be in the last position of the selectors" {}))))]
        candidate)
      (throw (ex-info (format "There should only be one of %s in the path.")
               {:candidates candidates})))))
```

---

## 33. hara-lang/hara — `core/lib/src/code/test/checker/collection.hal:24`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/test/checker/collection.hal" "code.test.checker.collection/verify-seq" 0]`
- **Role:** `:test`
- **Definition:** `code.test.checker.collection/verify-seq`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"modifiers can only be :gaps-ok and :in-any-order"
```

### Legacy form

```clojure
(ex-info "modifiers can only be :gaps-ok and :in-any-order"
                          {:modifiers modifiers})
```

### Enclosing definition

```clojure
(defn verify-seq [checkers data modifiers]
  (cond
    (= #{} modifiers) (util/contains-exact data checkers)
    (= #{:in-any-order} modifiers) (util/contains-any-order data checkers)
    (= #{:gaps-ok} modifiers) (util/contains-with-gaps data checkers)
    (= #{:in-any-order :gaps-ok} modifiers) (util/contains-all data checkers)
    :else (throw (ex-info "modifiers can only be :gaps-ok and :in-any-order"
                          {:modifiers modifiers}))))
```

---

## 34. hara-lang/hara — `core/lib/src/code/test/checker/collection.hal:62`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/test/checker/collection.hal" "code.test.checker.collection/contains" 0]`
- **Role:** `:test`
- **Definition:** `code.test.checker.collection/contains`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot create contains checker"
```

### Legacy form

```clojure
(ex-info "Cannot create contains checker"
                    {:input (vec (cons value modifiers))})
```

### Enclosing definition

```clojure
(defn contains [value & modifiers]
  (cond
    (map? value) (contains-map value)
    (set? value) (contains-set value)
    (or (vector? value) (list? value))
    (contains-vector value (set modifiers))
    :else
    (throw (ex-info "Cannot create contains checker"
                    {:input (vec (cons value modifiers))}))))
```

---

## 35. hara-lang/hara — `core/lib/src/code/test/checker/collection.hal:103`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/test/checker/collection.hal" "code.test.checker.collection/just" 0]`
- **Role:** `:test`
- **Definition:** `code.test.checker.collection/just`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot create just checker"
```

### Legacy form

```clojure
(ex-info "Cannot create just checker"
                    {:input (vec (cons value modifiers))})
```

### Enclosing definition

```clojure
(defn just [value & modifiers]
  (cond
    (map? value) (just-map value)
    (set? value) (just-set value)
    (or (vector? value) (list? value))
    (just-vector value (set modifiers))
    :else
    (throw (ex-info "Cannot create just checker"
                    {:input (vec (cons value modifiers))}))))
```

---

## 36. hara-lang/hara — `core/lib/src/code/translate/rule.hal:82`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/translate/rule.hal" "code.translate.rule/compile-rules" 1]`
- **Role:** `:production`
- **Definition:** `code.translate.rule/compile-rules`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Clojure to HAL rules are not priority ordered"
```

### Legacy form

```clojure
(ex-info "Clojure to HAL rules are not priority ordered"
                          {:previous previous-priority
                           :rule rule})
```

### Enclosing definition

```clojure
(defn compile-rules
  "Validates and indexes deterministic, evidence-backed translation rules."
  [rules]
  (loop [index 0
         previous-priority -1
         identifiers {}
         automatic-matchers {}
         output []]
    (if (= index (count rules))
      output
      (let [rule (nth rules index)
            identifier (:id rule)
            priority (:priority rule)
            match-key (matcher-key rule)]
        (if (not (rule-valid? rule))
          (throw (ex-info "Invalid Clojure to HAL rule"
                          {:rule rule
                           :index index})))
        (if (< priority previous-priority)
          (throw (ex-info "Clojure to HAL rules are not priority ordered"
                          {:previous previous-priority
                           :rule rule})))
        (if (has? identifiers identifier)
          (throw (ex-info "Duplicate Clojure to HAL rule identifier"
                          {:id identifier})))
        (if (and (automatic? rule)
                 (has? automatic-matchers match-key))
          (throw (ex-info "Conflicting automatic Clojure to HAL rules"
                          {:matcher match-key
                           :left (get automatic-matchers match-key)
                           :right identifier})))
        (recur
         (inc index)
         priority
         (assoc identifiers identifier true)
         (if (automatic? rule)
           (assoc automatic-matchers match-key identifier)
           automatic-matchers)
         (conj output (assoc rule :compiled/index index)))))))
```

---

## 37. hara-lang/hara — `core/lib/src/code/translate/rule.hal:110`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/code/translate/rule.hal" "code.translate.rule/selected-mode" 0]`
- **Role:** `:production`
- **Definition:** `code.translate.rule/selected-mode`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported Clojure to HAL translation mode"
```

### Legacy form

```clojure
(ex-info "Unsupported Clojure to HAL translation mode"
                      {:mode mode
                       :supported +modes+})
```

### Enclosing definition

```clojure
(defn selected-mode
  [options]
  (let [mode (or (:mode options) :review)]
    (if (not (has? +modes+ mode))
      (throw (ex-info "Unsupported Clojure to HAL translation mode"
                      {:mode mode
                       :supported +modes+})))
    mode))
```

---

## 38. hara-lang/hara — `core/lib/src/crypto/algo/shamir.hal:39`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/crypto/algo/shamir.hal" "std.crypto.shamir/gf-inverse" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/gf-inverse`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"cannot invert zero in GF(256)"
```

### Legacy form

```clojure
(ex-info "cannot invert zero in GF(256)" {:value value})
```

### Enclosing definition

```clojure
(defn gf-inverse
  [value]
  (if (= value 0)
    (throw (ex-info "cannot invert zero in GF(256)" {:value value}))
    (gf-power value 254)))
```

---

## 39. hara-lang/hara — `core/lib/src/crypto/algo/shamir.hal:77`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/crypto/algo/shamir.hal" "std.crypto.shamir/validate-split" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/validate-split`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"secret must not be empty"
```

### Legacy form

```clojure
(ex-info "secret must not be empty" {})
```

### Enclosing definition

```clojure
(defn validate-split
  [secret shares threshold coefficient-bytes]
  (let [length (Bytes/count secret)
        expected (* length (- threshold 1))]
    (if (= length 0)
      (throw (ex-info "secret must not be empty" {}))
      nil)
    (if (or (< threshold 2) (> threshold 255))
      (throw (ex-info "invalid threshold" {:threshold threshold}))
      nil)
    (if (or (< shares threshold) (> shares 255))
      (throw (ex-info "invalid share count" {:shares shares}))
      nil)
    (if (not (= expected (Bytes/count coefficient-bytes)))
      (throw (ex-info "invalid coefficient byte count"
                      {:expected expected
                       :actual (Bytes/count coefficient-bytes)}))
      nil)
    true))
```

---

## 40. hara-lang/hara — `core/lib/src/crypto/algo/shamir.hal:97`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/crypto/algo/shamir.hal" "std.crypto.shamir/entropy-byte-count" 0]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/entropy-byte-count`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"secret must not be empty"
```

### Legacy form

```clojure
(ex-info "secret must not be empty" {})
```

### Enclosing definition

```clojure
(defn entropy-byte-count
  "Returns the exact entropy requested from the crypto.random capability."
  [secret shares threshold]
  (let [length (Bytes/count secret)]
    (if (= length 0)
      (throw (ex-info "secret must not be empty" {}))
      nil)
    (if (or (< threshold 2) (> threshold 255))
      (throw (ex-info "invalid threshold" {:threshold threshold}))
      nil)
    (if (or (< shares threshold) (> shares 255))
      (throw (ex-info "invalid share count" {:shares shares}))
      nil)
    (* length (- threshold 1))))
```

---

## 41. hara-lang/hara — `core/lib/src/crypto/algo/shamir.hal:172`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/crypto/algo/shamir.hal" "std.crypto.shamir/validate-shares" 2]`
- **Role:** `:production`
- **Definition:** `std.crypto.shamir/validate-shares`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"inconsistent shares"
```

### Legacy form

```clojure
(ex-info "inconsistent shares" {:index index})
```

### Enclosing definition

```clojure
(defn validate-shares
  [shares]
  (if (< (count shares) 2)
    (throw (ex-info "at least two shares required" {}))
    nil)
  (let [length (Bytes/count (nth shares 0))
        indexes (indexes-of shares)]
    (if (< length 2)
      (throw (ex-info "invalid share length" {:length length}))
      nil)
    (loop [index 0]
      (if (< index (count shares))
        (let [share (nth shares index)
              share-index (nth indexes index)]
          (if (not (= length (Bytes/count share)))
            (throw (ex-info "inconsistent shares" {:index index}))
            nil)
          (if (or (= share-index 0)
                  (contains-index? indexes share-index index))
            (throw (ex-info "invalid or duplicate share indexes"
                            {:index share-index}))
            nil)
          (recur (inc index)))
        nil))
    indexes))
```

---

## 42. hara-lang/hara — `core/lib/src/db/node/kernel_supabase.hal:137`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/db/node/kernel_supabase.hal" "db.node.kernel-supabase/get-service" 0]`
- **Role:** `:production`
- **Definition:** `db.node.kernel-supabase/get-service`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Supabase service is not configured"
```

### Legacy form

```clojure
(ex-info "Supabase service is not configured"
                      {:service service-id})
```

### Enclosing definition

```clojure
(defn get-service
  "Returns a Supabase service or throws a structured missing-service error."
  [node service-id]
  (let [service (substrate/get-service node service-id)]
    (if service
      service
      (throw (ex-info "Supabase service is not configured"
                      {:service service-id})))))
```

---

## 43. hara-lang/hara — `core/lib/src/lang/common/book.hal:164`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/book.hal" "lang.common.book/assert-compatible-lang" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.book/assert-compatible-lang`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Book language is not compatible"
```

### Legacy form

```clojure
(ex-info "Book language is not compatible"
                    {:book (book-coordinate book)
                     :language lang
                     :merged (:merged book)})
```

### Enclosing definition

```clojure
(defn assert-compatible-lang
  [book lang]
  (if (not (compatible-lang? book lang))
    (throw (ex-info "Book language is not compatible"
                    {:book (book-coordinate book)
                     :language lang
                     :merged (:merged book)})))
  book)
```

---

## 44. hara-lang/hara — `core/lib/src/lang/common/book.hal:526`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/book.hal" "lang.common.book/book-merge" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.book/book-merge`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Books are not mergeable"
```

### Legacy form

```clojure
(ex-info "Books are not mergeable"
                    {:book (book-coordinate book)
                     :parent (book-coordinate parent)})
```

### Enclosing definition

```clojure
(defn book-merge
  [book parent]
  (if (not= (:parent book) (:lang parent))
    (throw (ex-info "Books are not mergeable"
                    {:book (book-coordinate book)
                     :parent (book-coordinate parent)})))
  (let [modules
        (reduce-kv
         (fn [output module-id parent-module]
           (let [child-module (get output module-id)]
             (assoc output module-id
                    (if child-module
                      (assoc child-module
                             :code (merge (:code parent-module) (:code child-module))
                             :fragment (merge (:fragment parent-module)
                                              (:fragment child-module)))
                      parent-module))))
         (:modules book)
         (:modules parent))]
    (next-revision
     (assoc book
            :modules modules
            :parent (:parent parent)
            :merged (conj (:merged book) (:lang parent))))))
```

---

## 45. hara-lang/hara — `core/lib/src/lang/common/compiler.hal:60`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/compiler.hal" ":top-level" 0]`
- **Role:** `:production`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Entry has no input form"
```

### Legacy form

```clojure
(ex-info "Entry has no input form" {:entry entry})
```

### Enclosing definition

```clojure
—
```

---

## 46. hara-lang/hara — `core/lib/src/lang/common/emit.hal:20`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit.hal" "lang.common.emit/fail" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit/fail`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
message
```

### Legacy form

```clojure
(ex-info message data)
```

### Enclosing definition

```clojure
(defn- fail [message data]
  (throw (ex-info message data)))
```

---

## 47. hara-lang/hara — `core/lib/src/lang/common/emit.hal:611`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit.hal" "lang.common.emit/prep-form" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit/prep-form`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unknown preparation step"
```

### Legacy form

```clojure
(ex-info "Unknown preparation step"
                                {:step step :form form})
```

### Enclosing definition

```clojure
(defn prep-form
  "prepares a form through raw, input, or staging"
  {:added "4.0"}
  [step form grammar book mopts]
  (let [input-form (preprocess/to-input form)]
    (cond (= step :raw) [form]
          (= step :input) [input-form]
          (= step :staging)
          (let [staged (preprocess/to-staging input-form grammar
                                              (or (:modules book) {}) mopts)
                rewritten (rewrite/rewrite-stage :staging (nth staged 0)
                                                  grammar
                                                  (assoc mopts :book book))]
            [rewritten (nth staged 1) (nth staged 2) (nth staged 3)])
          :else (throw (ex-info "Unknown preparation step"
                                {:step step :form form})))))
```

---

## 48. hara-lang/hara — `core/lib/src/lang/common/emit_assign.hal:69`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_assign.hal" "lang.common.emit-assign/emit-def-assign-inline" 1]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-assign/emit-def-assign-inline`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Inline cannot have additional dependencies"
```

### Legacy form

```clojure
(ex-info "Inline cannot have additional dependencies"
                        {:lang (:lang mopts) :input link :deps (:deps entry)})
```

### Enclosing definition

```clojure
(defn emit-def-assign-inline
  "assigns an inline function form directly"
  {:added "4.0"}
  [sym input-form grammar mopts]
  (let [link (first input-form)
        input (vec (rest input-form))
        pair (util/sym-pair link)
        book (or (:book mopts)
                 (get-in mopts [:snapshot (:lang mopts) :book]))
        raw-entry (get-in book [:modules (first pair) :code (second pair)])
        entry (if raw-entry
                (template/materialize-code-entry
                 book raw-entry
                 {:lang (:lang mopts)
                  :module (or (:module mopts)
                              (get-in book [:modules (first pair)]))})
                nil)]
    (if (nil? entry)
      (throw (ex-info "Cannot find inline entry"
                      {:lang (:lang mopts) :input link}))
      (if (not (empty? (:deps entry)))
        (throw (ex-info "Inline cannot have additional dependencies"
                        {:lang (:lang mopts) :input link :deps (:deps entry)}))
      (let [definition (vec (:form entry))
            args (nth definition 2)
            return-ref (atom nil)
            body (std.foundation/postwalk
                  (fn [form]
                    (if (list? form)
                      (if (= 'return (first form))
                        (if (deref return-ref)
                          (throw (ex-info "Inline cannot have multiple returns"
                                          {:input (deref return-ref)}))
                          (do (reset! return-ref (second form)) '<RETURN>))
                        (apply list
                               (reduce (fn [output value]
                                         (if (= value '<RETURN>)
                                           output
                                           (conj output value)))
                                       [] form)))
                      form))
                  (drop 3 definition))
            body (reduce (fn [output form]
                           (if (= form '<RETURN>)
                             output
                             (conj output form)))
                         [] body)
            returned (deref return-ref)
            _ (if (or (list? returned) (vector? returned)
                      (map? returned) (set? returned))
                (throw (ex-info "Return should be a token" {:input returned}))
                true)
            assign-ref (atom nil)
            _ (std.foundation/postwalk
               (fn [form]
                 (if (and (list? form) (= 'var (first form)))
                   (let [declared (first (filter symbol? (rest form)))]
                     (if (not (= returned declared))
                       (throw (ex-info "Inlined with unaccounted for declarations"
                                       {:link link :form body}))
                       (reset! assign-ref declared)))
                   nil)
                 form)
               body)
            assign-symbol (deref assign-ref)
            replacements (reduce (fn [output index]
                                   (assoc output (nth args index) (nth input index)))
                                 {}
                                 (range 0 (count args)))
            replacements (if (and (symbol? returned) assign-symbol)
                           (assoc replacements returned sym)
                           replacements)
            rewritten (replace-form replacements body)]
        (if (and (symbol? returned) assign-symbol)
          (apply list 'do* rewritten)
          (apply list 'do*
                 (concat rewritten
                         [(list 'var sym :=
                                (if (symbol? returned)
                                  (get replacements returned)
                                  returned))]))))))))
```

---

## 49. hara-lang/hara — `core/lib/src/lang/common/emit_assign.hal:79`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_assign.hal" "lang.common.emit-assign/emit-def-assign-inline" 2]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-assign/emit-def-assign-inline`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Inline cannot have multiple returns"
```

### Legacy form

```clojure
(ex-info "Inline cannot have multiple returns"
                                          {:input (deref return-ref)})
```

### Enclosing definition

```clojure
(defn emit-def-assign-inline
  "assigns an inline function form directly"
  {:added "4.0"}
  [sym input-form grammar mopts]
  (let [link (first input-form)
        input (vec (rest input-form))
        pair (util/sym-pair link)
        book (or (:book mopts)
                 (get-in mopts [:snapshot (:lang mopts) :book]))
        raw-entry (get-in book [:modules (first pair) :code (second pair)])
        entry (if raw-entry
                (template/materialize-code-entry
                 book raw-entry
                 {:lang (:lang mopts)
                  :module (or (:module mopts)
                              (get-in book [:modules (first pair)]))})
                nil)]
    (if (nil? entry)
      (throw (ex-info "Cannot find inline entry"
                      {:lang (:lang mopts) :input link}))
      (if (not (empty? (:deps entry)))
        (throw (ex-info "Inline cannot have additional dependencies"
                        {:lang (:lang mopts) :input link :deps (:deps entry)}))
      (let [definition (vec (:form entry))
            args (nth definition 2)
            return-ref (atom nil)
            body (std.foundation/postwalk
                  (fn [form]
                    (if (list? form)
                      (if (= 'return (first form))
                        (if (deref return-ref)
                          (throw (ex-info "Inline cannot have multiple returns"
                                          {:input (deref return-ref)}))
                          (do (reset! return-ref (second form)) '<RETURN>))
                        (apply list
                               (reduce (fn [output value]
                                         (if (= value '<RETURN>)
                                           output
                                           (conj output value)))
                                       [] form)))
                      form))
                  (drop 3 definition))
            body (reduce (fn [output form]
                           (if (= form '<RETURN>)
                             output
                             (conj output form)))
                         [] body)
            returned (deref return-ref)
            _ (if (or (list? returned) (vector? returned)
                      (map? returned) (set? returned))
                (throw (ex-info "Return should be a token" {:input returned}))
                true)
            assign-ref (atom nil)
            _ (std.foundation/postwalk
               (fn [form]
                 (if (and (list? form) (= 'var (first form)))
                   (let [declared (first (filter symbol? (rest form)))]
                     (if (not (= returned declared))
                       (throw (ex-info "Inlined with unaccounted for declarations"
                                       {:link link :form body}))
                       (reset! assign-ref declared)))
                   nil)
                 form)
               body)
            assign-symbol (deref assign-ref)
            replacements (reduce (fn [output index]
                                   (assoc output (nth args index) (nth input index)))
                                 {}
                                 (range 0 (count args)))
            replacements (if (and (symbol? returned) assign-symbol)
                           (assoc replacements returned sym)
                           replacements)
            rewritten (replace-form replacements body)]
        (if (and (symbol? returned) assign-symbol)
          (apply list 'do* rewritten)
          (apply list 'do*
                 (concat rewritten
                         [(list 'var sym :=
                                (if (symbol? returned)
                                  (get replacements returned)
                                  returned))]))))))))
```

---

## 50. hara-lang/hara — `core/lib/src/lang/common/emit_assign.hal:106`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_assign.hal" "lang.common.emit-assign/emit-def-assign-inline" 4]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-assign/emit-def-assign-inline`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Inlined with unaccounted for declarations"
```

### Legacy form

```clojure
(ex-info "Inlined with unaccounted for declarations"
                                       {:link link :form body})
```

### Enclosing definition

```clojure
(defn emit-def-assign-inline
  "assigns an inline function form directly"
  {:added "4.0"}
  [sym input-form grammar mopts]
  (let [link (first input-form)
        input (vec (rest input-form))
        pair (util/sym-pair link)
        book (or (:book mopts)
                 (get-in mopts [:snapshot (:lang mopts) :book]))
        raw-entry (get-in book [:modules (first pair) :code (second pair)])
        entry (if raw-entry
                (template/materialize-code-entry
                 book raw-entry
                 {:lang (:lang mopts)
                  :module (or (:module mopts)
                              (get-in book [:modules (first pair)]))})
                nil)]
    (if (nil? entry)
      (throw (ex-info "Cannot find inline entry"
                      {:lang (:lang mopts) :input link}))
      (if (not (empty? (:deps entry)))
        (throw (ex-info "Inline cannot have additional dependencies"
                        {:lang (:lang mopts) :input link :deps (:deps entry)}))
      (let [definition (vec (:form entry))
            args (nth definition 2)
            return-ref (atom nil)
            body (std.foundation/postwalk
                  (fn [form]
                    (if (list? form)
                      (if (= 'return (first form))
                        (if (deref return-ref)
                          (throw (ex-info "Inline cannot have multiple returns"
                                          {:input (deref return-ref)}))
                          (do (reset! return-ref (second form)) '<RETURN>))
                        (apply list
                               (reduce (fn [output value]
                                         (if (= value '<RETURN>)
                                           output
                                           (conj output value)))
                                       [] form)))
                      form))
                  (drop 3 definition))
            body (reduce (fn [output form]
                           (if (= form '<RETURN>)
                             output
                             (conj output form)))
                         [] body)
            returned (deref return-ref)
            _ (if (or (list? returned) (vector? returned)
                      (map? returned) (set? returned))
                (throw (ex-info "Return should be a token" {:input returned}))
                true)
            assign-ref (atom nil)
            _ (std.foundation/postwalk
               (fn [form]
                 (if (and (list? form) (= 'var (first form)))
                   (let [declared (first (filter symbol? (rest form)))]
                     (if (not (= returned declared))
                       (throw (ex-info "Inlined with unaccounted for declarations"
                                       {:link link :form body}))
                       (reset! assign-ref declared)))
                   nil)
                 form)
               body)
            assign-symbol (deref assign-ref)
            replacements (reduce (fn [output index]
                                   (assoc output (nth args index) (nth input index)))
                                 {}
                                 (range 0 (count args)))
            replacements (if (and (symbol? returned) assign-symbol)
                           (assoc replacements returned sym)
                           replacements)
            rewritten (replace-form replacements body)]
        (if (and (symbol? returned) assign-symbol)
          (apply list 'do* rewritten)
          (apply list 'do*
                 (concat rewritten
                         [(list 'var sym :=
                                (if (symbol? returned)
                                  (get replacements returned)
                                  returned))]))))))))
```

---

## 51. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:56`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-reserved-value" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-reserved-value`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Reserved value has no emitted representation"
```

### Legacy form

```clojure
(ex-info "Reserved value has no emitted representation"
                            {:form form :entry entry})
```

### Enclosing definition

```clojure
(defn emit-reserved-value
  "emits a reserved value"
  {:added "4.0"}
  [form grammar mopts]
  (let [entry (get-in grammar [:reserved form])]
    (if entry
      (if (:value entry)
        (or (:free entry) (:raw entry)
            (throw (ex-info "Reserved value has no emitted representation"
                            {:form form :entry entry})))
        (throw (ex-info "Reserved operation cannot be used as a value"
                        {:form form :entry entry})))
      nil)))
```

---

## 52. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:58`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-reserved-value" 1]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-reserved-value`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Reserved operation cannot be used as a value"
```

### Legacy form

```clojure
(ex-info "Reserved operation cannot be used as a value"
                        {:form form :entry entry})
```

### Enclosing definition

```clojure
(defn emit-reserved-value
  "emits a reserved value"
  {:added "4.0"}
  [form grammar mopts]
  (let [entry (get-in grammar [:reserved form])]
    (if entry
      (if (:value entry)
        (or (:free entry) (:raw entry)
            (throw (ex-info "Reserved value has no emitted representation"
                            {:form form :entry entry})))
        (throw (ex-info "Reserved operation cannot be used as a value"
                        {:form form :entry entry})))
      nil)))
```

---

## 53. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:122`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-macro" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-macro`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Macro operation has no expansion function"
```

### Legacy form

```clojure
(ex-info "Macro operation has no expansion function"
                      {:form form :entry entry})
```

### Enclosing definition

```clojure
(defn emit-macro
  "expands and emits a grammar macro"
  {:added "4.0"}
  [_ form grammar mopts]
  (let [entry (get-in grammar [:reserved (first form)])
        macro-fn (or (:macro entry) (:value/template entry))]
    (if macro-fn
      (*emit-fn* (macro-fn form) grammar mopts)
      (throw (ex-info "Macro operation has no expansion function"
                      {:form form :entry entry})))))
```

---

## 54. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:289`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-infix-if" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-infix-if`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"ternary cond has to end with :else"
```

### Legacy form

```clojure
(ex-info "ternary cond has to end with :else"
                          {:form final-pair})
```

### Enclosing definition

```clojure
(defn emit-infix-if
  "emits one or more ternary branches"
  {:added "3.0"}
  [form grammar mopts]
  (let [forms (vec (rest form))]
    (if (<= (count forms) 3)
      (emit-infix-if-single
       (if (= 2 (count forms))
         (list :? (nth forms 0) (nth forms 1) nil)
         (list :? (nth forms 0) (nth forms 1)
               (if (= :else (nth forms 2)) (nth forms 3) (nth forms 2))))
       grammar mopts)
      (let [pairs (vec (partition 2 forms))
            final-pair (last pairs)]
        (if (not (= :else (first final-pair)))
          (throw (ex-info "ternary cond has to end with :else"
                          {:form final-pair}))
          (emit-infix-if-single
           (reduce (fn [acc pair]
                     (list :? (first pair) (second pair) acc))
                   (second final-pair)
                   (reverse (drop-last-value pairs)))
           grammar mopts))))))
```

---

## 55. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:341`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-return-base" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-return-base`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"One or zero arguments for return"
```

### Legacy form

```clojure
(ex-info "One or zero arguments for return"
                      {:raw raw :arguments values})
```

### Enclosing definition

```clojure
(defn emit-return-base
  "emits the base return representation"
  {:added "4.0"}
  [raw args grammar mopts]
  (let [multi (get-in grammar [:default :return :multi])
        values (vec args)
        space (get-in grammar [:default :common :space])
        separator (get-in grammar [:default :common :sep])]
    (if (and (not multi) (> (count values) 1))
      (throw (ex-info "One or zero arguments for return"
                      {:raw raw :arguments values}))
      (str raw
           (if (empty? values) "" space)
           (str/join (str separator space)
                     (emit-array values grammar mopts))))))
```

---

## 56. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:721`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-op" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-op`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not allowed as op"
```

### Legacy form

```clojure
(ex-info "Not allowed as op" {:symbol (first form) :form form})
```

### Enclosing definition

```clojure
(defn emit-op
  "dispatches a reserved common operation"
  {:added "3.0"}
  ([key form grammar mopts]
   (emit-op key form grammar mopts {}))
  ([key form grammar mopts expansion]
   (let [entry (get-in grammar [:reserved (first form)])
         mode (:emit entry)
         raw (:raw entry)
         args (vec (rest form))
         custom (get expansion mode)]
     (cond (= mode :discard) ""
           (= mode :free) (emit-free (:sep entry) form grammar mopts)
           (= mode :squash) (emit-squash key form grammar mopts)
           (= mode :comment) (emit-comment raw form grammar mopts)
           (= mode :indent) (emit-indent key form grammar mopts)
           (= mode :token) raw
           (= mode :alias) (*emit-fn* (apply list (concat [raw] args)) grammar mopts)
           (= mode :unit) (emit-unit entry form grammar mopts)
           (= mode :internal) (emit-internal form grammar mopts)
           (= mode :internal-str) (emit-internal-str form grammar mopts)
           (= mode :pre) (emit-pre raw args grammar mopts)
           (= mode :post) (emit-post raw args grammar mopts)
           (= mode :prefix) (emit-prefix raw args grammar mopts)
           (= mode :postfix) (emit-postfix raw args grammar mopts)
           (= mode :infix) (emit-infix raw args grammar mopts)
           (= mode :infix-) (emit-infix-pre raw args grammar mopts)
           (= mode :infix*) (emit-infix-default raw args (:default entry) grammar mopts)
           (= mode :infix-if) (emit-infix-if form grammar mopts)
           (= mode :bi) (emit-bi raw args grammar mopts)
           (= mode :between) (emit-between raw args grammar mopts)
           (= mode :assign) (emit-assign raw args grammar mopts)
           (= mode :invoke) (emit-invoke-raw raw args grammar mopts)
           (= mode :new) (emit-new raw args grammar mopts)
           (= mode :static-invoke) (emit-class-static-invoke raw args grammar mopts)
           (= mode :index) (emit-index raw args grammar mopts)
           (= mode :return) (emit-return raw args grammar mopts)
           (or (= mode :macro) (= mode :template))
           (emit-macro key form grammar mopts)
           (or (= mode :hard-link) (= mode :alias))
           (*emit-fn* (apply list (concat [raw] args)) grammar mopts)
           (= mode :with-global) (emit-with-global key form grammar mopts)
           (= mode :with-decorate) (emit-with-decorate key form grammar mopts)
           (= mode :with-uuid) (emit-with-uuid key form grammar mopts)
           (= mode :with-rand) (emit-with-rand key form grammar mopts)
           (= mode :throw)
           (throw (ex-info "Not allowed as op" {:symbol (first form) :form form}))
           custom (custom key entry form grammar mopts)
           :else (throw (ex-info "No matching emit clause"
                                 {:emit mode :key key :form form :entry entry}))))))
```

---

## 57. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:723`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/emit-op" 1]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/emit-op`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No matching emit clause"
```

### Legacy form

```clojure
(ex-info "No matching emit clause"
                                 {:emit mode :key key :form form :entry entry})
```

### Enclosing definition

```clojure
(defn emit-op
  "dispatches a reserved common operation"
  {:added "3.0"}
  ([key form grammar mopts]
   (emit-op key form grammar mopts {}))
  ([key form grammar mopts expansion]
   (let [entry (get-in grammar [:reserved (first form)])
         mode (:emit entry)
         raw (:raw entry)
         args (vec (rest form))
         custom (get expansion mode)]
     (cond (= mode :discard) ""
           (= mode :free) (emit-free (:sep entry) form grammar mopts)
           (= mode :squash) (emit-squash key form grammar mopts)
           (= mode :comment) (emit-comment raw form grammar mopts)
           (= mode :indent) (emit-indent key form grammar mopts)
           (= mode :token) raw
           (= mode :alias) (*emit-fn* (apply list (concat [raw] args)) grammar mopts)
           (= mode :unit) (emit-unit entry form grammar mopts)
           (= mode :internal) (emit-internal form grammar mopts)
           (= mode :internal-str) (emit-internal-str form grammar mopts)
           (= mode :pre) (emit-pre raw args grammar mopts)
           (= mode :post) (emit-post raw args grammar mopts)
           (= mode :prefix) (emit-prefix raw args grammar mopts)
           (= mode :postfix) (emit-postfix raw args grammar mopts)
           (= mode :infix) (emit-infix raw args grammar mopts)
           (= mode :infix-) (emit-infix-pre raw args grammar mopts)
           (= mode :infix*) (emit-infix-default raw args (:default entry) grammar mopts)
           (= mode :infix-if) (emit-infix-if form grammar mopts)
           (= mode :bi) (emit-bi raw args grammar mopts)
           (= mode :between) (emit-between raw args grammar mopts)
           (= mode :assign) (emit-assign raw args grammar mopts)
           (= mode :invoke) (emit-invoke-raw raw args grammar mopts)
           (= mode :new) (emit-new raw args grammar mopts)
           (= mode :static-invoke) (emit-class-static-invoke raw args grammar mopts)
           (= mode :index) (emit-index raw args grammar mopts)
           (= mode :return) (emit-return raw args grammar mopts)
           (or (= mode :macro) (= mode :template))
           (emit-macro key form grammar mopts)
           (or (= mode :hard-link) (= mode :alias))
           (*emit-fn* (apply list (concat [raw] args)) grammar mopts)
           (= mode :with-global) (emit-with-global key form grammar mopts)
           (= mode :with-decorate) (emit-with-decorate key form grammar mopts)
           (= mode :with-uuid) (emit-with-uuid key form grammar mopts)
           (= mode :with-rand) (emit-with-rand key form grammar mopts)
           (= mode :throw)
           (throw (ex-info "Not allowed as op" {:symbol (first form) :form form}))
           custom (custom key entry form grammar mopts)
           :else (throw (ex-info "No matching emit clause"
                                 {:emit mode :key key :form form :entry entry}))))))
```

---

## 58. hara-lang/hara — `core/lib/src/lang/common/emit_common.hal:746`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_common.hal" "lang.common.emit-common/form-key" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-common/form-key`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Disallowed in form"
```

### Legacy form

```clojure
(ex-info "Disallowed in form"
                      {:form form :key key :type (second classified)})
```

### Enclosing definition

```clojure
(defn form-key
  "returns the grammar key and type associated with a form"
  {:added "3.0"}
  [form grammar]
  (let [base (helper/form-key-base form)
        classified-base
        (if (vector? base)
          base
          (let [entry (get-in grammar [:reserved (first form)])]
            (if entry
              [(:op entry) (or (:type entry) :statement)]
              [:invoke :invoke])))
        classified (if (= 2 (count classified-base))
                     (conj (vec classified-base) nil)
                     classified-base)
        key (first classified)]
    (if (reduce (fn [found banned-key]
                  (or found (= banned-key key)))
                false
                (or (:banned grammar) #{}))
      (throw (ex-info "Disallowed in form"
                      {:form form :key key :type (second classified)}))
      classified)))
```

---

## 59. hara-lang/hara — `core/lib/src/lang/common/emit_fn.hal:22`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_fn.hal" "lang.common.emit-fn/emit-input-default" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-fn/emit-input-default`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Rest argument emitter not configured"
```

### Legacy form

```clojure
(ex-info "Rest argument emitter not configured"
                        {:lang (:lang mopts) :symbol (:symbol argument)})
```

### Enclosing definition

```clojure
(defn emit-input-default
  "creates a typed input argument string"
  {:added "3.0"}
  [argument assign grammar mopts]
  (if (:rest argument)
    (let [rest-emitter (get-in grammar [:default :function :args :rest])]
      (if rest-emitter
        (rest-emitter argument grammar mopts)
        (throw (ex-info "Rest argument emitter not configured"
                        {:lang (:lang mopts) :symbol (:symbol argument)}))))
    (let [modifiers (or (:modifiers argument) [])
          type-values (or (:type argument) [])
          invoke-options (helper/get-options grammar [:default :invoke])
          reversed (:reversed invoke-options)
          hint (or (:hint invoke-options) "")
          uppercase (get-in invoke-options [:type :uppercase])
          modifier-words (reduce (fn [output value]
                                   (if (vector? value)
                                     output
                                     (conj output
                                           (emit-word value uppercase grammar mopts))))
                                 [] modifiers)
          type-words (reduce (fn [output value]
                               (conj output (emit-word value uppercase grammar mopts)))
                             [] type-values)
          has-words (or (> (count modifier-words) 0)
                        (> (count type-words) 0))
          symbol-output (if (:symbol argument)
                          (common/*emit-fn* (:symbol argument) grammar mopts)
                          "")
          symbol-output (if (and reversed has-words)
                          (str symbol-output hint)
                          symbol-output)
          word-output (if reversed
                        (concat (if (= 0 (count type-words)) modifier-words [])
                                (if (= "" symbol-output) [] [symbol-output])
                                type-words)
                        (concat modifier-words type-words
                                (if (= "" symbol-output) [] [symbol-output])))
          index-options (helper/get-options grammar [:default :index])
          arrays (reduce (fn [output value]
                           (if (vector? value)
                             (str output (:start index-options)
                                  (if (= 0 (count value)) ""
                                      (common/*emit-fn* (first value) grammar mopts))
                                  (:end index-options))
                             output))
                         "" modifiers)]
      (str (str/join " " word-output)
           arrays
           (if (or (:force argument) (not (nil? (:value argument))))
             (str " " assign " "
                  (common/*emit-fn* (:value argument) grammar mopts))
             "")))))
```

---

## 60. hara-lang/hara — `core/lib/src/lang/common/emit_helper.hal:208`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_helper.hal" "lang.common.emit-helper/emit-typed-allowed-args" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-helper/emit-typed-allowed-args`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot assign to non symbol"
```

### Legacy form

```clojure
(ex-info "Cannot assign to non symbol"
                {:curr current :all all})
```

### Enclosing definition

```clojure
(defn emit-typed-allowed-args
  "allowed declared args other than symbols"
  {:added "4.0"}
  [state grammar]
  (let [all (first state)
        current (second state)
        modifiers (:modifiers current)
        argument (last modifiers)
        allowed (get-option grammar [:allow] :assign)
        key (first (if (vector? (form-key-base argument))
                     (form-key-base argument)
                     [(form-key-base argument)]))]
    (if (key-member? allowed key)
      [all
       (assoc current
              :symbol argument
              :modifiers (vec (drop-last-one modifiers))
              :assign true)]
      (throw
       (ex-info "Cannot assign to non symbol"
                {:curr current :all all})))))
```

---

## 61. hara-lang/hara — `core/lib/src/lang/common/emit_helper.hal:364`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_helper.hal" "lang.common.emit-helper/emit-typed-args-loop" 1]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-helper/emit-typed-args-loop`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not a valid input"
```

### Legacy form

```clojure
(ex-info "Not a valid input"
                       {:input value
                        :all all
                        :curr current})
```

### Enclosing definition

```clojure
(defn- emit-typed-args-loop
  [grammar shorthand all current remaining]
  (if (= 0 (count remaining))
    (if (:symbol current)
      (conj all current)
      all)
    (let [value (first remaining)
          more (vec (drop 1 remaining))]
      (cond
             (= := value)
             (if (:symbol current)
               (emit-typed-args-loop
                grammar shorthand all
                (assoc current :assign true :force true)
                more)
               (let [allowed (emit-typed-allowed-args [all current] grammar)]
                 (emit-typed-args-loop
                  grammar shorthand
                  (first allowed)
                  (assoc (second allowed) :force true)
                  more)))

             (= :% value)
             (if (:symbol current)
               (emit-typed-args-loop
                grammar shorthand
                (conj all current)
                {:modifiers [(first more)]}
                (vec (drop 1 more)))
               (emit-typed-args-loop
                grammar shorthand all
                (assoc current
                       :modifiers
                       (conj (:modifiers current)
                             (first more)))
                (vec (drop 1 more))))

             (:assign current)
             (emit-typed-args-loop
              grammar shorthand
              (conj all (assoc current :value value))
              {:modifiers []}
              more)

             (rest-arg-form? value)
             (let [next-all (if (:symbol current)
                              (conj all current)
                              all)]
               (if (or (> (count more) 0)
                       (and (not (:symbol current))
                            (> (count (:modifiers current)) 0)))
                 (throw
                  (ex-info "Rest argument must be the final declared argument"
                           {:input value
                            :args remaining
                            :curr current}))
                 (emit-typed-args-loop
                  grammar shorthand next-all
                  {:modifiers []
                   :symbol (rest-arg-symbol value)
                   :rest true}
                  more)))

             (and (not (:symbol current))
                  (list? value)
                  (not (= -1 (index-of-value value :=))))
             (let [parts (vec (filter (fn [item] (not (= := item))) value))]
               (emit-typed-args-loop
                grammar shorthand
                (conj all
                      (assoc current
                             :symbol (first parts)
                             :value (second parts)))
                {:modifiers []}
                more))

             (or (and (symbol? value)
                      (not (and shorthand
                                (:symbol current)
                                (= 0 (count more)))))
                 (and (set? value)
                      (:set (get-in grammar [:allow :assign])))
                 (and (map? value)
                      (:map (get-in grammar [:allow :assign])))
                 (and (vector? value)
                      (:vector (get-in grammar [:allow :assign])))
                 (and (list? value)
                      (= 'quote (first value))
                      (:quote (get-in grammar [:allow :assign])))
                 (and (list? value)
                      (= := (first value))))
             (if (:symbol current)
               (emit-typed-args-loop
                grammar shorthand
                (conj all current)
                {:modifiers [] :symbol value}
                more)
               (emit-typed-args-loop
                grammar shorthand all
                (assoc current :symbol value)
                more))

             (and (list? value)
                  (keyword? (first value)))
             (if (:symbol current)
               (emit-typed-args-loop
                grammar shorthand
                (conj all current)
                {:type (drop-last-one value)
                 :symbol (last value)}
                more)
               (emit-typed-args-loop
                grammar shorthand all
                (assoc current
                       :type (drop-last-one value)
                       :symbol (last value))
                more))

             (and shorthand
                  (:symbol current)
                  (= 0 (count more))
                  (or (vector? value)
                      (map? value)
                      (set? value)))
             (emit-typed-args-loop
              grammar shorthand
              (conj all (assoc current :value value))
              {:modifiers []}
              more)

             (or (keyword? value) (vector? value))
             (if (:symbol current)
               (emit-typed-args-loop
                grammar shorthand
                (conj all current)
                {:modifiers [value]}
                more)
               (emit-typed-args-loop
                grammar shorthand all
                (assoc current
                       :modifiers
                       (conj (:modifiers current) value))
                more))

             (:symbol current)
             (emit-typed-args-loop
              grammar shorthand
              (conj all (assoc current :value value))
              {:modifiers []}
              more)

             :else
             (throw
              (ex-info "Not a valid input"
                       {:input value
                        :all all
                        :curr current}))))))
```

---

## 62. hara-lang/hara — `core/lib/src/lang/common/emit_top_level.hal:89`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/emit_top_level.hal" "lang.common.emit-top-level/emit-top-level" 1]`
- **Role:** `:production`
- **Definition:** `lang.common.emit-top-level/emit-top-level`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported top-level form"
```

### Legacy form

```clojure
(ex-info "Unsupported top-level form"
                                {:key key :form target-form})
```

### Enclosing definition

```clojure
(defn emit-top-level
  "emits a top-level definition form"
  {:added "3.0"}
  [key form grammar mopts]
  (let [values (vec form)
        tag (first values)
        original-symbol (second values)
        module-id (or (get-in mopts [:entry :module])
                      (get-in mopts [:module :id]))
        qualify (and (not (get (or (meta original-symbol) {}) :inner))
                     (or (member? #{:full :host} (:layout mopts))
                         (= key :defglobal)))
        _ (if (and qualify (nil? module-id))
            (throw (ex-info "Module not found"
                            (select-keys mopts [:module :entry])))
            true)
        target-symbol (if qualify
                        (with-meta (symbol (name module-id)
                                           (name original-symbol))
                          (meta original-symbol))
                        original-symbol)
        target-form (apply list tag target-symbol (drop 2 values))]
    (cond (or (= key :def) (= key :defglobal))
          (emit-def key target-form grammar mopts)
          (= key :defrun) (block/emit-do (drop 2 target-form) grammar mopts)
          (or (= key :defn) (= key :defgen))
          (function/emit-fn key target-form grammar mopts)
          (= key :declare) (emit-declare key target-form grammar mopts)
          :else (throw (ex-info "Unsupported top-level form"
                                {:key key :form target-form})))))
```

---

## 63. hara-lang/hara — `core/lib/src/lang/common/grammar.hal:331`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/grammar.hal" "lang.common.grammar/build:extend" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.grammar/build:extend`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Keys in original map"
```

### Legacy form

```clojure
(ex-info "Keys in original map"
                {:keys existing})
```

### Enclosing definition

```clojure
(defn build:extend
  "Adds operators not already present."
  [built additions]
  (let [existing
        (reduce (fn [keys pair]
                  (if (key-member? built (first pair))
                    (conj keys (first pair))
                    keys))
                #{}
                additions)]
    (if (> (count existing) 0)
      (throw
       (ex-info "Keys in original map"
                {:keys existing}))
      (reduce (fn [result pair]
                (assoc result
                       (first pair)
                       (normalize-op-entry (second pair))))
              built
              additions))))
```

---

## 64. hara-lang/hara — `core/lib/src/lang/common/grammar_api.hal:9`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/grammar_api.hal" "lang.common.grammar-api/fail" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.grammar-api/fail`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
message
```

### Legacy form

```clojure
(ex-info message data)
```

### Enclosing definition

```clojure
(defn- fail
  [message data]
  (throw (ex-info message data)))
```

---

## 65. hara-lang/hara — `core/lib/src/lang/common/grammar_macro.hal:151`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/grammar_macro.hal" "lang.common.grammar-macro/tf-tcond" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.grammar-macro/tf-tcond`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"ternary cond has to end with :else"
```

### Legacy form

```clojure
(ex-info "ternary cond has to end with :else"
                      {:form final-pair})
```

### Enclosing definition

```clojure
(defn tf-tcond
  "Transforms a ternary cond."
  [input]
  (let [pairs (vec
               (map vec
                    (partition 2 (drop 1 input))))
        final-pair (last pairs)]
    (if (not (= :else (first final-pair)))
      (throw (ex-info "ternary cond has to end with :else"
                      {:form final-pair}))
      (reduce (fn [result pair]
                (form [:? (first pair) [(second pair) result]]))
              (second final-pair)
              (reverse (all-but-last pairs))))))
```

---

## 66. hara-lang/hara — `core/lib/src/lang/common/provenance.hal:173`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/provenance.hal" "lang.common.provenance/error-with-provenance" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.provenance/error-with-provenance`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(if (ex-message t)
               (str message ": " (ex-message t))
               message)
```

### Legacy form

```clojure
(ex-info (if (ex-message t)
               (str message ": " (ex-message t))
               message)
             payload
             t)
```

### Enclosing definition

```clojure
(defn error-with-provenance
  [message data t]
  (let [cause-data (compat/canonicalize-map (ex-data t))
        data (compat/canonicalize-map data)
        current (frame data)
        inner-stack (provenance-stack cause-data)
        stack (append-frame (vec inner-stack) current)
        merged (if (seq stack)
                 (reduce merge {} (reverse stack))
                 {})
        wrapped? (compat/read-key cause-data :lang/wrapped)
        plain-data (dissoc data
                           :lang/provenance
                           :lang/provenance-stack
                           :book
                           :modules
                           :module
                           :entry
                           :grammar)
        payload-0 (merge cause-data plain-data merged)
        payload-1 (if (seq merged)
                    (assoc payload-0 :lang/provenance merged)
                    payload-0)
        payload-2 (if (seq stack)
                    (assoc payload-1 :lang/provenance-stack stack)
                    payload-1)
        payload-3 (assoc payload-2
                         :lang/wrapped true
                         :lang/cause-class (ex-class t)
                         :lang/cause-message (ex-message t))
        payload (if (and cause-data (not wrapped?))
                  (assoc payload-3 :lang/cause-data cause-data)
                  payload-3)]
    (ex-info (if (ex-message t)
               (str message ": " (ex-message t))
               message)
             payload
             t)))
```

---

## 67. hara-lang/hara — `core/lib/src/lang/common/registry.hal:44`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/registry.hal" ":top-level" 0]`
- **Role:** `:production`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Grammar source coordinate already installed"
```

### Legacy form

```clojure
(ex-info "Grammar source coordinate already installed"
                  {:coordinate coordinate})
```

### Enclosing definition

```clojure
—
```

---

## 68. hara-lang/hara — `core/lib/src/lang/common/util.hal:61`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/common/util.hal" "lang.common.util/lang-context" 0]`
- **Role:** `:production`
- **Definition:** `lang.common.util/lang-context`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No Lang Input"
```

### Legacy form

```clojure
(ex-info "No Lang Input" {:input lang})
```

### Enclosing definition

```clojure
(defn lang-context
  "Creates the context key for a language."
  [lang]
  (if lang
    (keyword (str "lang/" (name lang)))
    (throw (ex-info "No Lang Input" {:input lang}))))
```

---

## 69. hara-lang/hara — `core/lib/src/lang/core/compile.hal:271`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/compile.hal" "lang.core.compile/default-entry-compiler" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.compile/default-entry-compiler`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Tahto language book is not registered"
```

### Legacy form

```clojure
(ex-info "Tahto language book is not registered"
                      {:lang lang})
```

### Enclosing definition

```clojure
(defn default-entry-compiler
  "Compiles one registered entry with the selected portable language book."
  [options modules module entry]
  (let [lang (:lang options)
        book (or (:book options)
                 (registry/registry-book lang :default nil))]
    (if (nil? book)
      (throw (ex-info "Tahto language book is not registered"
                      {:lang lang}))
      (let [selected (:selection book)
            all-modules (merge (or (:modules book) {}) modules)
            context {:book (assoc book :modules all-modules)
                     :modules all-modules
                     :module module
                     :entry entry
                     :lang lang
                     :layout (or (:layout options) :module)
                     :emit (or (:emit options) {})}]
        (compiler/compile-entry
         (or (:compiler options) (compiler/compiler))
         entry
         selected
         context)))))
```

---

## 70. hara-lang/hara — `core/lib/src/lang/core/eval.hal:29`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/eval.hal" "lang.core.eval/plugin" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.eval/plugin`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Evaluation plugin is not registered"
```

### Legacy form

```clojure
(ex-info "Evaluation plugin is not registered"
                  {:plugin coordinate
                   :registered (keys (deref +plugins+))})
```

### Enclosing definition

```clojure
(defn plugin
  [coordinate]
  (let [coordinate (compat/canonical-coordinate coordinate)]
    (or (get (deref +plugins+) coordinate)
        (throw
         (ex-info "Evaluation plugin is not registered"
                  {:plugin coordinate
                   :registered (keys (deref +plugins+))})))))
```

---

## 71. hara-lang/hara — `core/lib/src/lang/core/eval.hal:91`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/eval.hal" "lang.core.eval/eval-raw-context" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.eval/eval-raw-context`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Evaluation context has no transport"
```

### Legacy form

```clojure
(ex-info "Evaluation context has no transport"
                {:context context})
```

### Enclosing definition

```clojure
(defn eval-raw-context
  "Bypasses semantic plugins and exposes the transport exchange."
  [context input options]
  (let [request (request input)
        eval-transport (get context :transport)]
    (if eval-transport
      (ensure-promise
       (transport/exchange eval-transport
                           (get request :input)
                           options))
      (throw
       (ex-info "Evaluation context has no transport"
                {:context context})))))
```

---

## 72. hara-lang/hara — `core/lib/src/lang/core/registry.hal:198`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/registry.hal" "lang.core.registry/registry-book-info" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.registry/registry-book-info`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Book version is not registered"
```

### Legacy form

```clojure
(ex-info "Book version is not registered"
                     {:language language
                      :key key
                      :version selected-version
                      :available (registry-book-versions language key)})
```

### Enclosing definition

```clojure
(defn registry-book-info
  "Returns version-specific metadata for a language book.

   Omitting version selects the coordinate's configured default."
  ([language]
   (registry-book-info language :default nil))
  ([language key]
   (registry-book-info language key nil))
  ([language key version]
   (let [entry (registry-book-entry language key)]
     (if (nil? entry)
       nil
       (let [selected-version (or version (get entry :default-version))
             info (get-in entry [:versions selected-version])]
         (if info
           (assoc info
                  :language language
                  :key key
                  :version selected-version
                  :default-version (get entry :default-version))
           (throw
            (ex-info "Book version is not registered"
                     {:language language
                      :key key
                      :version selected-version
                      :available (registry-book-versions language key)}))))))))
```

---

## 73. hara-lang/hara — `core/lib/src/lang/core/registry.hal:251`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/registry.hal" "lang.core.registry/registry-book-set-default" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.registry/registry-book-set-default`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Book coordinate is not registered"
```

### Legacy form

```clojure
(ex-info "Book coordinate is not registered"
                 {:language language :key key})
```

### Enclosing definition

```clojure
(defn registry-book-set-default
  "Changes versionless selection without replacing any installed version."
  ([language version]
   (registry-book-set-default language :default version))
  ([language key version]
   (let [entry (registry-book-entry language key)]
     (cond
       (nil? entry)
       (throw
        (ex-info "Book coordinate is not registered"
                 {:language language :key key}))

       (nil? (get-in entry [:versions version]))
       (throw
        (ex-info "Cannot select an unregistered book version"
                 {:language language
                  :key key
                  :version version
                  :available (registry-book-versions language key)}))

       :else
       (do
         (swap! +book-registry+
                assoc-in
                [[language key] :default-version]
                version)
         version)))))
```

---

## 74. hara-lang/hara — `core/lib/src/lang/core/registry.hal:256`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/registry.hal" "lang.core.registry/registry-book-set-default" 1]`
- **Role:** `:production`
- **Definition:** `lang.core.registry/registry-book-set-default`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot select an unregistered book version"
```

### Legacy form

```clojure
(ex-info "Cannot select an unregistered book version"
                 {:language language
                  :key key
                  :version version
                  :available (registry-book-versions language key)})
```

### Enclosing definition

```clojure
(defn registry-book-set-default
  "Changes versionless selection without replacing any installed version."
  ([language version]
   (registry-book-set-default language :default version))
  ([language key version]
   (let [entry (registry-book-entry language key)]
     (cond
       (nil? entry)
       (throw
        (ex-info "Book coordinate is not registered"
                 {:language language :key key}))

       (nil? (get-in entry [:versions version]))
       (throw
        (ex-info "Cannot select an unregistered book version"
                 {:language language
                  :key key
                  :version version
                  :available (registry-book-versions language key)}))

       :else
       (do
         (swap! +book-registry+
                assoc-in
                [[language key] :default-version]
                version)
         version)))))
```

---

## 75. hara-lang/hara — `core/lib/src/lang/core/registry.hal:280`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/core/registry.hal" "lang.core.registry/registry-book-remove" 0]`
- **Role:** `:production`
- **Definition:** `lang.core.registry/registry-book-remove`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot remove an unregistered book version"
```

### Legacy form

```clojure
(ex-info "Cannot remove an unregistered book version"
                 {:language language
                  :key key
                  :version version
                  :available (registry-book-versions language key)})
```

### Enclosing definition

```clojure
(defn registry-book-remove
  "Removes one version. Removing the default chooses the lowest remaining version."
  ([language version]
   (registry-book-remove language :default version))
  ([language key version]
   (let [coordinate [language key]
         entry (registry-book-entry language key)
         removed (get-in entry [:versions version])]
     (if (nil? removed)
       (throw
        (ex-info "Cannot remove an unregistered book version"
                 {:language language
                  :key key
                  :version version
                  :available (registry-book-versions language key)}))
       (do
         (swap!
          +book-registry+
          (fn [all]
            (let [current (get all coordinate)
                  remaining (dissoc (get current :versions) version)]
              (if (empty? remaining)
                (dissoc all coordinate)
                (let [next-default
                      (if (= version (get current :default-version))
                        (first (sort (keys remaining)))
                        (get current :default-version))]
                  (assoc all coordinate
                         {:default-version next-default
                          :versions remaining}))))))
         (assoc removed
                :language language
                :key key
                :version version))))))
```

---

## 76. hara-lang/hara — `core/lib/src/lang/model/v1/spec_hara/emit.hal:292`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/model/v1/spec_hara/emit.hal" "lang.model.v1.spec-hara.emit/lower-assignment" 0]`
- **Role:** `:production`
- **Definition:** `lang.model.v1.spec-hara.emit/lower-assignment`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported Hara assignment target"
```

### Legacy form

```clojure
(ex-info "Unsupported Hara assignment target"
              {:target target
               :lang/error-code :lang.hara/unsupported-assignment})
```

### Enclosing definition

```clojure
(defn lower-assignment
  [target value context]
  (cond
    (symbol? target)
    (if (mutable-symbol? target context)
      (list 'reset! target (lower value context))
      (list 'set! (lower-symbol target (assoc context :mutable #{}))
            (lower value context)))

    (indexed-target target)
    (let [{:keys [root path]} (indexed-target target)]
      (mutation-call root
                     'lang.runtime.standard/set-path
                     [(mapv #(lower % context) path)
                      value]
                     context))

    :else
    (throw
     (ex-info "Unsupported Hara assignment target"
              {:target target
               :lang/error-code :lang.hara/unsupported-assignment}))))
```

---

## 77. hara-lang/hara — `core/lib/src/lang/model/v1/spec_hara/emit.hal:699`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/model/v1/spec_hara/emit.hal" "lang.model.v1.spec-hara.emit/lower-list" 0]`
- **Role:** `:production`
- **Definition:** `lang.model.v1.spec-hara.emit/lower-list`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"XTalk var must occur within a body"
```

### Legacy form

```clojure
(ex-info "XTalk var must occur within a body"
                  {:form value
                   :lang/error-code :lang.hara/unscoped-var})
```

### Enclosing definition

```clojure
(defn lower-list
  [value context]
  (let [operation (first value)
        x-output (lower-x-call value context)]
    (if (not= +not-handled+ x-output)
      x-output
      (cond
        (= 'quote operation) value
        (= '% operation) (lower (second value) context)
        (= 'do operation) (lower-body (rest value) context)
        (= 'do* operation) (lower-body (rest value) context)
        (= 'block operation) (lower-body (drop 2 value) context)
        (= 'fn operation) (lower-fn value context)
        (= 'defn operation) (lower-defn value context)
        (= 'defn- operation) (lower-defn value context)
        (= 'defgen operation) (lower-defn (cons 'defn (rest value)) context)
        (= 'def operation) (lower-def value context)
        (= 'defglobal operation) (lower-def (cons 'def (rest value)) context)
        (= 'return operation) (lower-return value context)
        (= := operation) (lower-assignment (second value) (nth value 2) context)
        (= :+= operation) (lower-assignment
                           (second value)
                           (list '+ (second value) (nth value 2))
                           context)
        (= :-= operation) (lower-assignment
                           (second value)
                           (list '- (second value) (nth value 2))
                           context)
        (= :*= operation) (lower-assignment
                           (second value)
                           (list '* (second value) (nth value 2))
                           context)
        (= :++ operation) (lower-assignment
                           (second value)
                           (list '+ (second value) 1)
                           context)
        (= :-- operation) (lower-assignment
                           (second value)
                           (list '- (second value) 1)
                           context)
        (= :? operation) (list 'if
                               (lower (second value) context)
                               (lower (nth value 2) context)
                               (lower (nth value 3) context))
        (= '== operation) (form (concat ['=] (map #(lower % context) (rest value))))
        (= 'pow operation) (form (concat ['pow] (map #(lower % context) (rest value))))
        (= 'b:& operation) (form (concat ['bit-and] (map #(lower % context) (rest value))))
        (= 'b:| operation) (form (concat ['bit-or] (map #(lower % context) (rest value))))
        (= 'b:xor operation) (form (concat ['bit-xor] (map #(lower % context) (rest value))))
        (= 'b:<< operation) (form (concat ['bit-shift-left] (map #(lower % context) (rest value))))
        (= 'b:>> operation) (form (concat ['bit-shift-right] (map #(lower % context) (rest value))))
        (= '. operation) (lower-index value context)
        (= 'br* operation) (lower-branch value context)
        (= 'try operation) (lower-try value context)
        (= 'while operation) (lower-while value context)
        (= 'for:index operation) (lower-for-index value context)
        (= 'for:array operation) (lower-for-array value context)
        (= 'for:object operation) (lower-for-object value context)
        (= 'for:iter operation) (lower-for-iter value context)
        (= 'await operation) (list 'deref (lower (second value) context))
        (= 'async operation) (list 'std.foundation.promise/run
                                  (list 'fn []
                                        (lower-body (rest value) context)))
        (= 'new operation) (form (concat ['new]
                                         (map #(lower % context) (rest value))))
        (= 'var operation)
        (throw
         (ex-info "XTalk var must occur within a body"
                  {:form value
                   :lang/error-code :lang.hara/unscoped-var}))
        (and (symbol? operation)
             (not (namespace operation))
             (str/starts-with? (name operation) "x:"))
        (throw
         (ex-info "XTalk operation is not implemented by the Hara target"
                  {:operation operation
                   :form value
                   :lang/error-code :lang.hara/unsupported-operation}))
        :else
        (form (concat [(lower operation context)]
                      (map #(lower % context) (rest value))))))))
```

---

## 78. hara-lang/hara — `core/lib/src/lang/model/v1/spec_hara/emit.hal:706`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/model/v1/spec_hara/emit.hal" "lang.model.v1.spec-hara.emit/lower-list" 1]`
- **Role:** `:production`
- **Definition:** `lang.model.v1.spec-hara.emit/lower-list`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"XTalk operation is not implemented by the Hara target"
```

### Legacy form

```clojure
(ex-info "XTalk operation is not implemented by the Hara target"
                  {:operation operation
                   :form value
                   :lang/error-code :lang.hara/unsupported-operation})
```

### Enclosing definition

```clojure
(defn lower-list
  [value context]
  (let [operation (first value)
        x-output (lower-x-call value context)]
    (if (not= +not-handled+ x-output)
      x-output
      (cond
        (= 'quote operation) value
        (= '% operation) (lower (second value) context)
        (= 'do operation) (lower-body (rest value) context)
        (= 'do* operation) (lower-body (rest value) context)
        (= 'block operation) (lower-body (drop 2 value) context)
        (= 'fn operation) (lower-fn value context)
        (= 'defn operation) (lower-defn value context)
        (= 'defn- operation) (lower-defn value context)
        (= 'defgen operation) (lower-defn (cons 'defn (rest value)) context)
        (= 'def operation) (lower-def value context)
        (= 'defglobal operation) (lower-def (cons 'def (rest value)) context)
        (= 'return operation) (lower-return value context)
        (= := operation) (lower-assignment (second value) (nth value 2) context)
        (= :+= operation) (lower-assignment
                           (second value)
                           (list '+ (second value) (nth value 2))
                           context)
        (= :-= operation) (lower-assignment
                           (second value)
                           (list '- (second value) (nth value 2))
                           context)
        (= :*= operation) (lower-assignment
                           (second value)
                           (list '* (second value) (nth value 2))
                           context)
        (= :++ operation) (lower-assignment
                           (second value)
                           (list '+ (second value) 1)
                           context)
        (= :-- operation) (lower-assignment
                           (second value)
                           (list '- (second value) 1)
                           context)
        (= :? operation) (list 'if
                               (lower (second value) context)
                               (lower (nth value 2) context)
                               (lower (nth value 3) context))
        (= '== operation) (form (concat ['=] (map #(lower % context) (rest value))))
        (= 'pow operation) (form (concat ['pow] (map #(lower % context) (rest value))))
        (= 'b:& operation) (form (concat ['bit-and] (map #(lower % context) (rest value))))
        (= 'b:| operation) (form (concat ['bit-or] (map #(lower % context) (rest value))))
        (= 'b:xor operation) (form (concat ['bit-xor] (map #(lower % context) (rest value))))
        (= 'b:<< operation) (form (concat ['bit-shift-left] (map #(lower % context) (rest value))))
        (= 'b:>> operation) (form (concat ['bit-shift-right] (map #(lower % context) (rest value))))
        (= '. operation) (lower-index value context)
        (= 'br* operation) (lower-branch value context)
        (= 'try operation) (lower-try value context)
        (= 'while operation) (lower-while value context)
        (= 'for:index operation) (lower-for-index value context)
        (= 'for:array operation) (lower-for-array value context)
        (= 'for:object operation) (lower-for-object value context)
        (= 'for:iter operation) (lower-for-iter value context)
        (= 'await operation) (list 'deref (lower (second value) context))
        (= 'async operation) (list 'std.foundation.promise/run
                                  (list 'fn []
                                        (lower-body (rest value) context)))
        (= 'new operation) (form (concat ['new]
                                         (map #(lower % context) (rest value))))
        (= 'var operation)
        (throw
         (ex-info "XTalk var must occur within a body"
                  {:form value
                   :lang/error-code :lang.hara/unscoped-var}))
        (and (symbol? operation)
             (not (namespace operation))
             (str/starts-with? (name operation) "x:"))
        (throw
         (ex-info "XTalk operation is not implemented by the Hara target"
                  {:operation operation
                   :form value
                   :lang/error-code :lang.hara/unsupported-operation}))
        :else
        (form (concat [(lower operation context)]
                      (map #(lower % context) (rest value))))))))
```

---

## 79. hara-lang/hara — `core/lib/src/lang/model/v1/spec_lua/lua_rewrite.hal:223`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/model/v1/spec_lua/lua_rewrite.hal" "lang.model.v1.spec-lua.lua-rewrite/lua-lower-rest-callable" 0]`
- **Role:** `:production`
- **Definition:** `lang.model.v1.spec-lua.lua-rewrite/lua-lower-rest-callable`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Only one rest argument is allowed"
```

### Legacy form

```clojure
(ex-info "Only one rest argument is allowed" {:form form :args args})
```

### Enclosing definition

```clojure
(defn- lua-lower-rest-callable
  [form]
  (let [[tag head & tail] form
        [name args body] (if (symbol? head)
                           [head (first tail) (rest tail)]
                           [nil head tail])
        rest-args (vec (filter lua-rest-arg-form? args))]
    (cond
      (empty? rest-args) form
      (< 1 (count rest-args))
      (throw (ex-info "Only one rest argument is allowed" {:form form :args args}))
      (not= (last args) (first rest-args))
      (throw (ex-info "Rest argument must be final" {:form form :args args}))
      :else
      (let [rest-sym (second (first rest-args))
            body (cons (list 'var rest-sym [(list ':- "...")]) body)
            out (if name
                  (apply list tag name args body)
                  (apply list tag args body))]
        (with-form-meta form out)))))
```

---

## 80. hara-lang/hara — `core/lib/src/lang/seedgen.hal:88`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/seedgen.hal" "lang.seedgen/seedgen-work" 0]`
- **Role:** `:production`
- **Definition:** `lang.seedgen/seedgen-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported seedgen workflow"
```

### Legacy form

```clojure
(ex-info "Unsupported seedgen workflow" {:operation operation})
```

### Enclosing definition

```clojure
(defn seedgen-work
  [operation]
  (command/batch
   {:id (keyword (str "lang.seedgen/" (name operation)))
    :version 1}
   {:list (work/pure :list-tests (fn [input context] (:units input)))
    :filter (work/pure :seed-root? (fn [unit context] (seedgen-root unit)))
    :process (work/pure :process-test
                        (fn [unit context]
                          (cond (= operation :root) (seedgen-root unit)
                                (= operation :list) (seedgen-list unit)
                                (= operation :incomplete) (incomplete unit)
                                (= operation :benchadd) (bench-plan unit (:language unit) (:test-root unit))
                                :else (throw (ex-info "Unsupported seedgen workflow" {:operation operation})))))
    :summarise (work/pure :summarise
                          (fn [batch context]
                            {:operation operation :count (count (:results batch))}))}))
```

---

## 81. hara-lang/hara — `core/lib/src/lang/typed/xtalk_common.hal:227`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/lang/typed/xtalk_common.hal" "lang.typed.xtalk-common/normalize-type" 0]`
- **Role:** `:production`
- **Definition:** `lang.typed.xtalk-common/normalize-type`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported type form"
```

### Legacy form

```clojure
(ex-info "Unsupported type form"
                    {:form form
                     :context ctx})
```

### Enclosing definition

```clojure
(defn normalize-type
  [form ctx]
  (cond
    (nil? form)
    +nil-type+

    (keyword? form)
    (if (= :xt/self form)
      (or (:self ctx) +unknown-type+)
      (if (has? +primitive-types+ form)
        (primitive-type form)
        {:kind :keyword :name form}))

    (symbol? form)
    {:kind :named :name (resolve-type-symbol form ctx)}

    (string? form)
    {:kind :named :name form}

    (vector? form)
    (let [[op & args] form]
      (case op
        :maybe
        {:kind :maybe
         :item (normalize-type (first args) ctx)}

        :xt/maybe
        {:kind :maybe
         :item (normalize-type (first args) ctx)}

        :or
        {:kind :union
         :types (mapv #(normalize-type % ctx) args)}

        :xt/or
        {:kind :union
         :types (mapv #(normalize-type % ctx) args)}

        :and
        {:kind :intersection
         :types (mapv #(normalize-type % ctx) args)}

        :xt/and
        {:kind :intersection
         :types (mapv #(normalize-type % ctx) args)}

        :tuple
        {:kind :tuple
         :types (mapv #(normalize-type % ctx) args)}

        :xt/tuple
        {:kind :tuple
         :types (mapv #(normalize-type % ctx) args)}

        :array
        {:kind :array
         :item (normalize-type (first args) ctx)}

        :xt/array
        {:kind :array
         :item (normalize-type (first args) ctx)}

        :dict
        {:kind :dict
         :key (normalize-type (first args) ctx)
         :value (normalize-type (second args) ctx)}

        :xt/dict
        {:kind :dict
         :key (normalize-type (first args) ctx)
         :value (normalize-type (second args) ctx)}

        :record
        {:kind :record
         :fields (mapv #(normalize-record-field % ctx) args)}

        :xt/record
        {:kind :record
         :fields (mapv #(normalize-record-field % ctx) args)}

        :fn
        {:kind :fn
         :inputs (mapv #(normalize-type % ctx) (first args))
         :output (normalize-type (second args) ctx)}

        :xt/fn
        {:kind :fn
         :inputs (mapv #(normalize-type % ctx) (first args))
         :output (normalize-type (second args) ctx)}

        :>
        {:kind :apply
         :target (normalize-apply-target (first args) ctx)
         :args (mapv #(normalize-type % ctx) (rest args))}

        :xt/apply
        {:kind :apply
         :target (normalize-apply-target (first args) ctx)
         :args (mapv #(normalize-type % ctx) (rest args))}

        {:kind :tuple
         :types (mapv #(normalize-type % ctx) form)}))

    :else
    (throw (ex-info "Unsupported type form"
                    {:form form
                     :context ctx}))))
```

---

## 82. hara-lang/hara — `core/lib/src/std/block/heal/core.hal:313`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/block/heal/core.hal" "std.block.heal.core/heal-content-complex-edits" 0]`
- **Role:** `:production`
- **Definition:** `std.block.heal.core/heal-content-complex-edits`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not Supported"
```

### Legacy form

```clojure
(ex-info "Not Supported" {:info info})
```

### Enclosing definition

```clojure
(defn heal-content-complex-edits
  [info errors]
  (let [migration-errors-three errors
        e1                     (first (drop 0 migration-errors-three))
        e2                     (first (drop 1 migration-errors-three))
        e3                     (first (drop 2 migration-errors-three))
        more                   (drop 3 migration-errors-three)
        lead                   (get-in info [:at :lead])]
    (cond (and (= (:type e1) :close)
            (= (:style lead) (:style e1))
            (= -1 (:depth e1))
            (= :open (:type e2))
            (= :close (:type e3)))
      (edit/create-remove-edits [e3])
      (and (even? (count errors)) (every? :pair-id errors))
      (edit/create-mismatch-edits errors)
      :else
      (do (env/prn) (env/prf info) (throw (ex-info "Not Supported" {:info info}))))))
```

---

## 83. hara-lang/hara — `core/lib/src/std/block/heal/core.hal:362`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/block/heal/core.hal" "std.block.heal.core/heal-content-single-pass" 0]`
- **Role:** `:production`
- **Definition:** `std.block.heal.core/heal-content-single-pass`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not Supported"
```

### Legacy form

```clojure
(ex-info "Not Supported" {:info info})
```

### Enclosing definition

```clojure
(defn heal-content-single-pass
  "heals the content in a single pass"
  {:added "4.0"}
  [content]
  (let [{:keys [lines
                entries
                delimiters
                starts]}   (group-blocks-prep content)
        blocks             (group-blocks-multi entries)
        errored            (get-errored-raw lines blocks)
        edits              (mapcat
                            (fn
                             [{:as info :keys [errors at]}]
                             (let
                              [migration-errors-two errors
                               e1                   (first (drop 0 migration-errors-two))
                               e2                   (first (drop 1 migration-errors-two))
                               more                 (drop 2 migration-errors-two)]
                              (cond
                               (and (= (:type e1) :open) (nil? e2))
                               (let
                                [closed             (->>
                                                     delimiters
                                                     (filter
                                                      (fn
                                                       [migration-argument-0]
                                                       (= ((keyword "type") migration-argument-0) (keyword "close"))))
                                                     (group-by :line))
                                 {:keys [line col]} (first
                                                     (keep
                                                      (fn [migration-argument-0] (last (get closed migration-argument-0)))
                                                      (reverse (range (first (:line at)) (inc (second (:line at)))))))]
                                [{:action :insert :col col :line line :new-char (parse/lu-close (:char e1))}])
                               (and (= (:type e1) :close) (nil? e2))
                               (edit/create-remove-edits [e1])
                               (and (= (:type e1) :close) (= (:type e2) :close))
                               (edit/create-remove-edits [e1 e2])
                               (and (= (:type e1) :open) (= (:type e2) :close))
                               (edit/create-mismatch-edits [e1 e2])
                               :else
                               (heal-content-complex-edits info errors))))
                            errored)
        new-content        (try (edit/update-content content edits)
                             (catch Throwable
                               t
                               (mapv (fn [{:as info :keys [at]}]
                                       (env/prn info)
                                       (throw (ex-info "Not Supported" {:info info})))
                                 errored)
                               (throw t)))]
    new-content))
```

---

## 84. hara-lang/hara — `core/lib/src/std/config/global.hal:48`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/config/global.hal" "std.config.global/global" 0]`
- **Role:** `:production`
- **Definition:** `std.config.global/global`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unknown global configuration source"
```

### Legacy form

```clojure
(ex-info "Unknown global configuration source"
               {:source kind})
```

### Enclosing definition

```clojure
(defn global
  "Returns portable global configuration. Session overrides project data, and
   project data overrides explicit environment data."
  ([]
   (global :all {}))
  ([kind]
   (global kind {}))
  ([kind context]
   (case kind
     :env (environment context)
     :project (current-project context)
     :session (session)
     :all (global-all context)
     (throw
      (ex-info "Unknown global configuration source"
               {:source kind})))))
```

---

## 85. hara-lang/hara — `core/lib/src/std/context/registry.hal:73`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/registry.hal" "std.context.registry/registry-get" 0]`
- **Role:** `:production`
- **Definition:** `std.context.registry/registry-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No context available"
```

### Legacy form

```clojure
(ex-info "No context available"
                      {:context context :options (registry-list)})
```

### Enclosing definition

```clojure
(defn registry-get [context]
  (or (get (deref *registry*) context)
      (throw (ex-info "No context available"
                      {:context context :options (registry-list)}))))
```

---

## 86. hara-lang/hara — `core/lib/src/std/context/resource.hal:59`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/resource.hal" "std.context.resource/spec-get" 0]`
- **Role:** `:production`
- **Definition:** `std.context.resource/spec-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No resource spec available"
```

### Legacy form

```clojure
(ex-info "No resource spec available"
                      {:type type :options (spec-list)})
```

### Enclosing definition

```clojure
(defn spec-get [type]
  (or (get (deref *resource-registry*) type)
      (throw (ex-info "No resource spec available"
                      {:type type :options (spec-list)}))))
```

---

## 87. hara-lang/hara — `core/lib/src/std/context/resource.hal:88`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/resource.hal" "std.context.resource/variant-get" 0]`
- **Role:** `:production`
- **Definition:** `std.context.resource/variant-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No resource variant available"
```

### Legacy form

```clojure
(ex-info "No resource variant available"
                       {:type type :variant id
                        :options (keys (:variant spec))})
```

### Enclosing definition

```clojure
(defn variant-get
  ([type] (variant-get type :default))
  ([type id]
   (let [spec (spec-get type)
         variant (get-in spec [:variant id])]
     (if variant
       (resource-merge-config (dissoc spec :variant) variant)
       (throw (ex-info "No resource variant available"
                       {:type type :variant id
                        :options (keys (:variant spec))}))))))
```

---

## 88. hara-lang/hara — `core/lib/src/std/context/resource.hal:161`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/resource.hal" "std.context.resource/resource-key" 0]`
- **Role:** `:production`
- **Definition:** `std.context.resource/resource-key`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported resource mode"
```

### Legacy form

```clojure
(ex-info "Unsupported resource mode" {:mode mode})
```

### Enclosing definition

```clojure
(defn resource-key [mode type variant input & arguments]
  (let [input (or (last arguments) input)]
    (case mode
      :global nil
      :namespace (or (if (map? input) (:namespace input) input)
                     *resource-namespace*
                     :default)
      :shared (if (map? input)
                (let [key-function (get-in (variant-get type variant)
                                           [:mode :key])]
                  (key-function input))
                input)
      (throw (ex-info "Unsupported resource mode" {:mode mode})))))
```

---

## 89. hara-lang/hara — `core/lib/src/std/context/resource.hal:182`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/resource.hal" "std.context.resource/resource-active-start" 0]`
- **Role:** `:production`
- **Definition:** `std.context.resource/resource-active-start`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Resource already started"
```

### Legacy form

```clojure
(ex-info "Resource already started"
                    {:type type :variant variant :key key})
```

### Enclosing definition

```clojure
(defn resource-active-start [mode type variant key config]
  (if (resource-active-get mode type variant key)
    (throw (ex-info "Resource already started"
                    {:type type :variant variant :key key}))
    (let [instance (resource-setup type variant config)]
      (resource-active-set mode type variant key
                           {:key key :config config :instance instance})
      instance)))
```

---

## 90. hara-lang/hara — `core/lib/src/std/context/resource.hal:211`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/context/resource.hal" "std.context.resource/resource-active-get-or-start" 0]`
- **Role:** `:production`
- **Definition:** `std.context.resource/resource-active-get-or-start`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Resource mode not allowed"
```

### Legacy form

```clojure
(ex-info "Resource mode not allowed"
                      {:mode mode :options allowed})
```

### Enclosing definition

```clojure
(defn resource-active-get-or-start [mode type variant key config]
  (let [spec (variant-get type variant)
        allowed (get-in spec [:mode :allow])]
    (if (not (has? allowed mode))
      (throw (ex-info "Resource mode not allowed"
                      {:mode mode :options allowed})))
    (or (:instance (resource-active-get mode type variant key))
        (resource-active-start mode type variant key config))))
```

---

## 91. hara-lang/hara — `core/lib/src/std/dom/common.hal:23`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/common.hal" "std.dom.common/dom-field-set" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.common/dom-field-set`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unknown DOM field"
```

### Legacy form

```clojure
(ex-info "Unknown DOM field" {:field key})
```

### Enclosing definition

```clojure
(defn dom-field-set
  [dom key value]
  (case key
    :tag     (set! (field dom :tag)     value)
    :props   (set! (field dom :props)   value)
    :item    (set! (field dom :item)    value)
    :parent  (set! (field dom :parent)  value)
    :handler (set! (field dom :handler) value)
    :shadow  (set! (field dom :shadow)  value)
    :cache   (set! (field dom :cache)   value)
    :extra   (set! (field dom :extra)   value)
    (throw (ex-info "Unknown DOM field" {:field key})))
  dom)
```

---

## 92. hara-lang/hara — `core/lib/src/std/dom/common.hal:92`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/common.hal" "std.dom.common/dom-new" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.common/dom-new`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No tag available"
```

### Legacy form

```clojure
(ex-info "No tag available" {:tag tag})
```

### Enclosing definition

```clojure
(defn dom-new
  ([] (dom-new nil))
  ([value]
   (cond (keyword? value) (dom-new value nil)
         (map? value) (let [{:keys [tag props item parent handler shadow cache extra]} value]
                        (dom-new tag props item parent handler shadow cache extra))))
  ([tag props] (dom-new tag props nil nil nil nil nil nil))
  ([tag props item parent handler shadow cache extra]
   (if-not (type/metaprops tag)
     (throw (ex-info "No tag available" {:tag tag})))
   (Dom tag props item parent handler shadow cache extra)))
```

---

## 93. hara-lang/hara — `core/lib/src/std/dom/item.hal:10`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/item.hal" "std.dom.item/item-constructor" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.item/item-constructor`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No constructor"
```

### Legacy form

```clojure
(ex-info "No constructor"
                      {:tag tag :metaprops (type/metaprops tag)})
```

### Enclosing definition

```clojure
(defmethod item-constructor :default [tag]
  (or (:construct (type/metaprops tag))
      (throw (ex-info "No constructor"
                      {:tag tag :metaprops (type/metaprops tag)}))))
```

---

## 94. hara-lang/hara — `core/lib/src/std/dom/item.hal:20`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/item.hal" "std.dom.item/item-setters" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.item/item-setters`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No setters"
```

### Legacy form

```clojure
(ex-info "No setters" {:tag tag :metaprops metaprops})
```

### Enclosing definition

```clojure
(defmethod item-setters :default [tag]
  (let [metaprops (type/metaprops tag)]
    (if (= :dom/element (:metatype metaprops))
      (:setters metaprops)
      (throw (ex-info "No setters" {:tag tag :metaprops metaprops})))))
```

---

## 95. hara-lang/hara — `core/lib/src/std/dom/item.hal:29`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/item.hal" "std.dom.item/item-getters" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.item/item-getters`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No getters"
```

### Legacy form

```clojure
(ex-info "No getters" {:tag tag :metaprops metaprops})
```

### Enclosing definition

```clojure
(defmethod item-getters :default [tag]
  (let [metaprops (type/metaprops tag)]
    (if (= :dom/element (:metatype metaprops))
      (:getters metaprops)
      (throw (ex-info "No getters" {:tag tag :metaprops metaprops})))))
```

---

## 96. hara-lang/hara — `core/lib/src/std/dom/item.hal:47`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/item.hal" "std.dom.item/item-props-update-default" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.item/item-props-update-default`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot update props"
```

### Legacy form

```clojure
(ex-info "Cannot update props"
                      {:metatype metatype :metaprops metaprops
                       :tag tag :item item :ops ops})
```

### Enclosing definition

```clojure
(defn item-props-update-default [tag item ops]
  (let [metaprops (type/metaprops tag)
        metatype (:metatype metaprops)]
    (if (= :dom/element metatype)
      item
      (throw (ex-info "Cannot update props"
                      {:metatype metatype :metaprops metaprops
                       :tag tag :item item :ops ops})))))
```

---

## 97. hara-lang/hara — `core/lib/src/std/dom/type.hal:34`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/type.hal" "std.dom.type/metaprops-add" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.type/metaprops-add`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No meta type available"
```

### Legacy form

```clojure
(ex-info "No meta type available"
                    {:type id
                     :input entry
                     :available (vec (sort (keys (metaclass))))})
```

### Enclosing definition

```clojure
(defn metaprops-add
  [id entry]
  (if-not (metaclass id)
    (throw (ex-info "No meta type available"
                    {:type id
                     :input entry
                     :available (vec (sort (keys (metaclass))))})))
  (let [{:keys [metatype]} (metaclass id)
        {:keys [tag] :as entry} (assoc entry :metaclass id :metatype metatype)]
    (if-not tag
      (throw (ex-info ":tag required" {:input entry})))
    (swap! +metaprops-tag+ assoc tag entry)
    entry))
```

---

## 98. hara-lang/hara — `core/lib/src/std/dom/update.hal:66`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/update.hal" "std.dom.update/update-props-update" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.update/update-props-update`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not Supported"
```

### Legacy form

```clojure
(ex-info "Not Supported"
                                              {:dom node :val value :op op})
```

### Enclosing definition

```clojure
(defn update-props-update [node props [_ key ops :as op]]
  (let [value (get props key)
        new-value (cond (dom/dom? value) (dom-apply value ops)
                        (sequential? value) (update-list node key value ops)
                        :else (throw (ex-info "Not Supported"
                                              {:dom node :val value :op op})))]
    (assoc props key new-value)))
```

---

## 99. hara-lang/hara — `core/lib/src/std/dom/update.hal:76`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/dom/update.hal" "std.dom.update/update-props" 0]`
- **Role:** `:production`
- **Definition:** `std.dom.update/update-props`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not Supported"
```

### Legacy form

```clojure
(ex-info "Not Supported" {:props props :op op})
```

### Enclosing definition

```clojure
(defn update-props [node props ops]
  (reduce (fn [props [action :as op]]
            (case action
              :set (update-set props op)
              :delete (update-props-delete props op)
              :update (update-props-update node props op)
              (throw (ex-info "Not Supported" {:props props :op op}))))
          props
          ops))
```

---

## 100. hara-lang/hara — `core/lib/src/std/lib/time.hal:15`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/lib/time.hal" "std.lib.time/fail" 0]`
- **Role:** `:production`
- **Definition:** `std.lib.time/fail`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
message
```

### Legacy form

```clojure
(ex-info message data)
```

### Enclosing definition

```clojure
(defn- fail [message data] (throw (ex-info message data)))
```

---

## 101. hara-lang/hara — `core/lib/src/std/lib/zip.hal:262`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/lib/zip.hal" "std.lib.zip/list-child-elements" 0]`
- **Role:** `:production`
- **Definition:** `std.lib.zip/list-child-elements`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not a org."
```

### Legacy form

```clojure
(ex-info "Not a org." {:element elem})
```

### Enclosing definition

```clojure
(defn list-child-elements
  "lists elements of a container"
  {:added "3.0"}
  ([zip] (list-child-elements zip :right))
  ([{:as zip :keys [context]} direction] (let [elem     (first (std.foundation/get zip direction))
                                               check-fn (:is-container? context)
                                               list-fn  (:list-elements context)]
                                           (if (check-fn elem)
                                             (list-fn elem)
                                             (throw (ex-info "Not a org." {:element elem}))))))
```

---

## 102. hara-lang/hara — `core/lib/src/std/lib/zip.hal:277`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/lib/zip.hal" "std.lib.zip/update-child-elements" 0]`
- **Role:** `:production`
- **Definition:** `std.lib.zip/update-child-elements`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Not a container."
```

### Legacy form

```clojure
(ex-info "Not a container." {:element old})
```

### Enclosing definition

```clojure
(defn update-child-elements
  "updates elements of a container"
  {:added "3.0"}
  ([zip child-elements]
   (update-child-elements zip child-elements :right))
  ([{:keys [context] :as zip} child-elements direction]
   (update-in zip
              [direction]
              (fn [elements]
                (let [check-fn  (:is-container? context)
                      update-fn (:update-elements context)
                      old   (first elements)
                      _     (if-not (check-fn old)
                              (throw (ex-info "Not a container." {:element old})))
                      new   (update-fn old
                                       child-elements)]
                  (cons new (rest elements)))))))
```

---

## 103. hara-lang/hara — `core/lib/src/std/lib/zip.hal:753`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/lib/zip.hal" "std.lib.zip/form-zip" 0]`
- **Role:** `:production`
- **Definition:** `std.lib.zip/form-zip`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported container type for update"
```

### Legacy form

```clojure
(ex-info "Unsupported container type for update" {:type (type container)})
```

### Enclosing definition

```clojure
(defn form-zip
  "creates a form zip"
  {:added "4.0"}
  ([root]
   (form-zip root nil))
  ([root opts]
   (zipper root
           (merge {:wrap-data         form-zip-wrap
                   :unwrap-data       form-zip-unwrap
                   :create-container  (fn [] '()) ; Default to an empty list for new containers
                   :create-element    identity
                   :is-container?       (fn [x] (or (list? x) (vector? x) (map? x) (set? x)))
                   :is-empty-container? empty?
                   :is-element?         (complement nil?)
                   :list-elements     seq
                   :update-elements   (fn [container new-elements]
                                        ;; Reconstructs the container, preserving its original type
                                        (cond
                                          (list? container) (apply list new-elements)
                                          (vector? container) (vec new-elements)
                                          (map? container) (into {} new-elements)
                                          (set? container) (into #{} new-elements)
                                          :else (throw (ex-info "Unsupported container type for update" {:type (type container)}))))
                   :add-element       (fn [container element]
                                        ;; Adds an element, preserving container type.
                                        ;; Note: conj behavior varies by collection type (front for lists, end for vectors).
                                        (cond
                                          (list? container) (concat container [element])
                                          (vector? container) (conj container element)
                                          (map? container) (conj container element)
                                          (set? container) (conj container element)
                                          :else (throw (ex-info "Unsupported container type for add" {:type (type container)}))))}
                  +base+)
           opts)))
```

---

## 104. hara-lang/hara — `core/lib/src/std/lib/zip.hal:762`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/lib/zip.hal" "std.lib.zip/form-zip" 1]`
- **Role:** `:production`
- **Definition:** `std.lib.zip/form-zip`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported container type for add"
```

### Legacy form

```clojure
(ex-info "Unsupported container type for add" {:type (type container)})
```

### Enclosing definition

```clojure
(defn form-zip
  "creates a form zip"
  {:added "4.0"}
  ([root]
   (form-zip root nil))
  ([root opts]
   (zipper root
           (merge {:wrap-data         form-zip-wrap
                   :unwrap-data       form-zip-unwrap
                   :create-container  (fn [] '()) ; Default to an empty list for new containers
                   :create-element    identity
                   :is-container?       (fn [x] (or (list? x) (vector? x) (map? x) (set? x)))
                   :is-empty-container? empty?
                   :is-element?         (complement nil?)
                   :list-elements     seq
                   :update-elements   (fn [container new-elements]
                                        ;; Reconstructs the container, preserving its original type
                                        (cond
                                          (list? container) (apply list new-elements)
                                          (vector? container) (vec new-elements)
                                          (map? container) (into {} new-elements)
                                          (set? container) (into #{} new-elements)
                                          :else (throw (ex-info "Unsupported container type for update" {:type (type container)}))))
                   :add-element       (fn [container element]
                                        ;; Adds an element, preserving container type.
                                        ;; Note: conj behavior varies by collection type (front for lists, end for vectors).
                                        (cond
                                          (list? container) (concat container [element])
                                          (vector? container) (conj container element)
                                          (map? container) (conj container element)
                                          (set? container) (conj container element)
                                          :else (throw (ex-info "Unsupported container type for add" {:type (type container)}))))}
                  +base+)
           opts)))
```

---

## 105. hara-lang/hara — `core/lib/src/std/substrate/util.hal:160`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/substrate/util.hal" "std.substrate.util/config-normalize-space" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-space`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "space id mismatch - " space-id)
```

### Legacy form

```clojure
(ex-info (str "space id mismatch - " space-id)
                        {:space-id space-id :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-space
  "Normalises declarative space config."
  [space-id config]
  (cond
    (nil? config) nil

    (map? config)
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id space-id))
        (throw (ex-info (str "space id mismatch - " space-id)
                        {:space-id space-id :config config}))
        {"state" (or (get config "state") (get config :state))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid space config - " space-id)
                    {:space-id space-id :config config}))))
```

---

## 106. hara-lang/hara — `core/lib/src/std/substrate/util.hal:180`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/substrate/util.hal" "std.substrate.util/config-normalize-handler" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-handler`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "handler id mismatch - " action)
```

### Legacy form

```clojure
(ex-info (str "handler id mismatch - " action)
                        {:action action :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-handler
  "Normalises handler config from a function or declarative entry."
  [action config]
  (cond
    (fn? config)
    {"fn" config "meta" {}}

    (and (map? config)
         (fn? (or (get config "fn") (get config :fn))))
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id action))
        (throw (ex-info (str "handler id mismatch - " action)
                        {:action action :config config}))
        {"fn" (or (get config "fn") (get config :fn))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid handler config - " action)
                    {:action action :config config}))))
```

---

## 107. hara-lang/hara — `core/lib/src/std/substrate/util.hal:200`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/std/substrate/util.hal" "std.substrate.util/config-normalize-trigger" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-trigger`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "trigger id mismatch - " signal)
```

### Legacy form

```clojure
(ex-info (str "trigger id mismatch - " signal)
                        {:signal signal :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-trigger
  "Normalises trigger config from a function or declarative entry."
  [signal config]
  (cond
    (fn? config)
    {"fn" config "meta" {}}

    (and (map? config)
         (fn? (or (get config "fn") (get config :fn))))
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id signal))
        (throw (ex-info (str "trigger id mismatch - " signal)
                        {:signal signal :config config}))
        {"fn" (or (get config "fn") (get config :fn))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid trigger config - " signal)
                    {:signal signal :config config}))))
```

---

## 108. hara-lang/hara — `core/lib/src/tool/cli/extension.hal:125`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/extension.hal" "tool.cli.extension/validate-manifest" 8]`
- **Role:** `:production`
- **Definition:** `tool.cli.extension/validate-manifest`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "unsupported extension provider " provider)
```

### Legacy form

```clojure
(ex-info (str "unsupported extension provider " provider) {})
```

### Enclosing definition

```clojure
(defn validate-manifest [namespace document origin]
  (if (not (map? document))
    (throw (ex-info (str "extension/malformed " origin ": manifest must be a map") {}))
    nil)
  (let [unknown (vec (filter (fn [key] (not (get +manifest-fields+ key)))
                             (keys document)))]
    (if (empty? unknown)
      nil
      (throw (ex-info (str "extension/malformed " origin
                           ": unknown manifest fields " unknown)
                      {:fields unknown}))))
  (let [namespace (str namespace)
        provider (required document :provider origin)
        abi (required document :abi origin)
        exports (or (:exports document) {})
        capabilities (or (:capabilities document) [])
        module (:module document)
        targets (:targets document)
        target-paths (target-files targets)
        assets (or (:assets document) [])
        root (if-let [value (:root document)] (asset/safe-path value) nil)]
    (if (valid-namespace? namespace)
      nil
      (throw (ex-info "namespace must be a qualified lower-case symbol"
                      {:namespace namespace})))
    (if (and (map? exports)
             (every? (fn [entry] (do (validate-export (key entry) (val entry)) true))
                     exports))
      nil
      (throw (ex-info "extension :exports must be a map" {})))
    (if (and (vector? capabilities) (every? keyword? capabilities))
      nil
      (throw (ex-info "extension :capabilities must be a keyword vector" {})))
    (if (and (vector? assets) (every? string? assets))
      nil
      (throw (ex-info "extension :assets must be a string vector" {})))
    (cond
      (= provider :wasm)
      (if (and (string? module) (empty? target-paths) (= abi :core.v1))
        nil
        (throw (ex-info
                "WASM providers require :module, :abi :core.v1, and cannot declare :targets"
                {})))
      (= provider :hta)
      (if (and (nil? module) (not (empty? target-paths)) (= abi :hta.v1))
        nil
        (throw (ex-info
                "HTA providers require :targets, :abi :hta.v1, and cannot declare :module"
                {})))
      :else
      (throw (ex-info (str "unsupported extension provider " provider) {})))
    (assoc document
           :namespace namespace
           :declared/files
           (vec (distinct
                 (sort
                  (concat (if module [(declared-path root module)] [])
                          (map (fn [path] (declared-path root path)) target-paths)
                          (map (fn [path] (declared-path root path)) assets))))))))
```

---

## 109. hara-lang/hara — `core/lib/src/tool/cli/host.hal:24`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/host.hal" "tool.cli.host/execute" 2]`
- **Role:** `:production`
- **Definition:** `tool.cli.host/execute`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str (name action) " accepts no arguments")
```

### Legacy form

```clojure
(ex-info (str (name action) " accepts no arguments")
                      {:arguments arguments})
```

### Enclosing definition

```clojure
(defn execute [request]
  (let [action (get +route-actions+ (:request/route request))
        arguments (:request/arguments request)]
    (if (nil? action)
      (throw (ex-info (str "unsupported host route: " (:request/route request)) {}))
      nil)
    (if (and (= action :remote) (not= 1 (count arguments)))
      (throw (ex-info "remote requires HOST:PORT" {:arguments arguments}))
      nil)
    (if (and (not= action :remote)
             (not= action :compile-halc)
             (not (empty? arguments)))
      (throw (ex-info (str (name action) " accepts no arguments")
                      {:arguments arguments}))
      nil)
    (model/success {:host/action action
                    :host/arguments (vec arguments)})))
```

---

## 110. hara-lang/hara — `core/lib/src/tool/cli/identity.hal:83`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/identity.hal" "tool.cli.identity/fetch-challenge" 0]`
- **Role:** `:production`
- **Definition:** `tool.cli.identity/fetch-challenge`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"identity service returned an empty challenge"
```

### Legacy form

```clojure
(ex-info "identity service returned an empty challenge" {})
```

### Enclosing definition

```clojure
(defn fetch-challenge [owner]
  (let [challenge (str/trim
                   (request "GET"
                            (str "/v1/enrollments/challenge?owner=" owner)
                            nil))]
    (if (str/blank? challenge)
      (throw (ex-info "identity service returned an empty challenge" {}))
      challenge)))
```

---

## 111. hara-lang/hara — `core/lib/src/tool/cli/project_build_manifest.hal:41`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/project_build_manifest.hal" "tool.cli.project-build-manifest/extend" 1]`
- **Role:** `:production`
- **Definition:** `tool.cli.project-build-manifest/extend`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"CLI route and handler ids do not match"
```

### Legacy form

```clojure
(ex-info "CLI route and handler ids do not match"
                      {:route/handler (:route/handler route)
                       :handler/id (:handler/id handler)})
```

### Enclosing definition

```clojure
(defn extend
  "Applies one deterministic CLI manifest extension without duplicating it."
  [manifest extension]
  (let [app-id (:app/id extension)
        route (:route extension)
        handler (:handler extension)]
    (if (nil? (entry-by (:cli/apps manifest) :app/id app-id))
      (throw (ex-info (str "CLI manifest is missing app " app-id)
                      {:app/id app-id}))
      nil)
    (if (not= (:route/handler route) (:handler/id handler))
      (throw (ex-info "CLI route and handler ids do not match"
                      {:route/handler (:route/handler route)
                       :handler/id (:handler/id handler)}))
      nil)
    (assoc manifest
           :cli/apps
           (vec (map (fn [app] (extend-project-app app extension))
                     (:cli/apps manifest)))
           :cli/routes
           (append-once (:cli/routes manifest) :route/id route)
           :cli/handlers
           (append-once (:cli/handlers manifest) :handler/id handler))))
```

---

## 112. hara-lang/hara — `core/lib/src/tool/cli/spec.hal:111`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/spec.hal" "tool.cli.spec/validate" 1]`
- **Role:** `:production`
- **Definition:** `tool.cli.spec/validate`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"the --against meta-spec does not pass structural lint"
```

### Legacy form

```clojure
(ex-info
                  "the --against meta-spec does not pass structural lint"
                  {:findings structural})
```

### Enclosing definition

```clojure
(defn validate [arguments]
  (let [parsed (parse-format arguments)
        values (:arguments parsed)]
    (if (or (not= 3 (count values)) (not= "--against" (second values)))
      (throw (ex-info "spec validate requires FILE --against METASPEC" {}))
      (let [path (first values)
            document (read-document path)
            against (read-document (nth values 2))
            structural (metaspec/lint against)]
        (if (not (empty? structural))
          (throw (ex-info
                  "the --against meta-spec does not pass structural lint"
                  {:findings structural}))
          (report-result
           document
           (metaspec/conforms document {:metaspec against :document-path path})
           (:format parsed)))))))
```

---

## 113. hara-lang/hara — `core/lib/src/tool/cli/tap.hal:129`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/tap.hal" "tool.cli.tap/execute" 1]`
- **Role:** `:production`
- **Definition:** `tool.cli.tap/execute`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "tap " (name operation) " is not implemented in Hara yet")
```

### Legacy form

```clojure
(ex-info (str "tap " (name operation) " is not implemented in Hara yet")
                      {:operation operation})
```

### Enclosing definition

```clojure
(defn execute [request]
  (let [resolved (operation-request request)
        operation (:operation resolved)
        parsed (parse-arguments (:arguments resolved))
        root (native/tap-config-root)]
    (cond
      (= operation :bootstrap)
      (let [values (require-positionals parsed 1 "tap bootstrap requires PROFILE")
            tap (native/tap-bootstrap root (first values))]
        (model/success tap
                       [(model/message
                         (str "bootstrapped tap " (:name tap) "\n"))]))

      (= operation :add)
      (let [values (require-positionals parsed 1 "tap add requires NAME")
            tap (native/tap-add root
                                (first values)
                                (get (:options parsed) :registry [])
                                (get (:options parsed) :identity [])
                                (require-option parsed :identity-key))]
        (model/success tap
                       [(model/message (str "trusted tap " (:name tap) "\n"))]))

      (= operation :remove)
      (let [values (require-positionals parsed 1 "tap remove requires NAME")
            name (first values)]
        (native/tap-remove root name)
        (model/success {:tap/name name}
                       [(model/message (str "removed tap " name "\n"))]))

      (= operation :list)
      (let [_ (require-positionals parsed 0 "tap list accepts no arguments")
            taps (native/tap-list root)]
        (model/success taps
                       [(model/message (apply str (map tap-line taps)))]))

      (= operation :mirror)
      (let [values (require-positionals parsed 2 "tap mirror add requires NAME")]
        (if (not= "add" (first values))
          (throw (ex-info "tap mirror currently requires the add operation" {}))
          (let [tap (native/tap-mirror-add
                     root (second values)
                     (get (:options parsed) :registry)
                     (get (:options parsed) :identity))]
            (model/success tap [(model/message (tap-line tap))]))))

      (= operation :init)
      (let [values (require-positionals parsed 1 "tap init requires NAME")
            result (native/tap-initialize
                    root (first values)
                    (require-option parsed :registry)
                    (require-option parsed :identity)
                    (require-option parsed :identity-root-key))]
        (model/success
         result
         [(model/message
           (str "initialized tap " (first values) "\n"
                "identity-root fingerprint: " (:fingerprint result) "\n"))]))

      (= operation :verify)
      (let [values (require-positionals parsed 1 "tap verify requires NAME")
            result (native/tap-verify root (first values))]
        (model/success
         result
         [(model/message
           (str "tap verify: " (:name result)
                " identity=" (:revision result) "\n"))]))

      :else
      (throw (ex-info (str "tap " (name operation) " is not implemented in Hara yet")
                      {:operation operation})))))
```

---

## 114. hara-lang/hara — `core/lib/src/tool/cli/template.hal:133`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/template.hal" "tool.cli.template/validate-result" 0]`
- **Role:** `:production`
- **Definition:** `tool.cli.template/validate-result`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"CLI handler returned a non-map result"
```

### Legacy form

```clojure
(ex-info "CLI handler returned a non-map result"
              {:result result})
```

### Enclosing definition

```clojure
(defn validate-result
  "Validates the final closed-registry result envelope and returns it."
  [result]
  (if (not (map? result))
    (throw
     (ex-info "CLI handler returned a non-map result"
              {:result result})))
  (let [outcome (:result/outcome result)
        exit (:result/exit result)
        messages (:result/messages result)]
    (if (not (has? model/+outcome-exits+ outcome))
      (throw
       (ex-info "CLI handler returned an unknown outcome"
                {:outcome outcome
                 :result result})))
    (if (not= exit (model/outcome-exit outcome))
      (throw
       (ex-info "CLI handler result exit does not match its outcome"
                {:outcome outcome
                 :exit exit
                 :expected (model/outcome-exit outcome)})))
    (if (not (vector? messages))
      (throw
       (ex-info "CLI handler :result/messages must be a vector"
                {:messages messages})))
    (if (not (every? valid-message? messages))
      (throw
       (ex-info "CLI handler returned an invalid message envelope"
                {:messages messages}))))
  result)
```

---

## 115. hara-lang/hara — `core/lib/src/tool/cli/template.hal:140`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/cli/template.hal" "tool.cli.template/validate-result" 1]`
- **Role:** `:production`
- **Definition:** `tool.cli.template/validate-result`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"CLI handler returned an unknown outcome"
```

### Legacy form

```clojure
(ex-info "CLI handler returned an unknown outcome"
                {:outcome outcome
                 :result result})
```

### Enclosing definition

```clojure
(defn validate-result
  "Validates the final closed-registry result envelope and returns it."
  [result]
  (if (not (map? result))
    (throw
     (ex-info "CLI handler returned a non-map result"
              {:result result})))
  (let [outcome (:result/outcome result)
        exit (:result/exit result)
        messages (:result/messages result)]
    (if (not (has? model/+outcome-exits+ outcome))
      (throw
       (ex-info "CLI handler returned an unknown outcome"
                {:outcome outcome
                 :result result})))
    (if (not= exit (model/outcome-exit outcome))
      (throw
       (ex-info "CLI handler result exit does not match its outcome"
                {:outcome outcome
                 :exit exit
                 :expected (model/outcome-exit outcome)})))
    (if (not (vector? messages))
      (throw
       (ex-info "CLI handler :result/messages must be a vector"
                {:messages messages})))
    (if (not (every? valid-message? messages))
      (throw
       (ex-info "CLI handler returned an invalid message envelope"
                {:messages messages}))))
  result)
```

---

## 116. hara-lang/hara — `core/lib/src/tool/inrepl.hal:254`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/inrepl.hal" "tool.inrepl/reset" 0]`
- **Role:** `:production`
- **Definition:** `tool.inrepl/reset`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Hara in-REPL never resets ROOT"
```

### Legacy form

```clojure
(ex-info "Hara in-REPL never resets ROOT" {:session session})
```

### Enclosing definition

```clojure
(defn reset
  ([endpoint] (reset endpoint +agent-session+))
  ([endpoint session]
   (if (= session "ROOT")
     (throw (ex-info "Hara in-REPL never resets ROOT" {:session session})))
   (with-client endpoint
     (fn [connection stream state]
       (let [sessions (session-names (request-next connection stream state "SESSION" ["LIST"]))]
         (if (some (fn [name] (= name session)) sessions)
           (request-next connection stream state "SESSION" ["CLOSE" session])))
       (request-next connection stream state "SESSION" ["NEW" session])
       (request-next connection stream state "SESSION" ["ATTACH" session])
       {:endpoint endpoint :session session :reset true}))))
```

---

## 117. hara-lang/hara — `core/lib/src/tool/project/production.hal:15`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/project/production.hal" "tool.project.production/fail" 0]`
- **Role:** `:production`
- **Definition:** `tool.project.production/fail`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
message
```

### Legacy form

```clojure
(ex-info message data)
```

### Enclosing definition

```clojure
(defn fail
  ([message] (fail message {}))
  ([message data]
   (throw (ex-info message data))))
```

---

## 118. hara-lang/hara — `core/lib/src/tool/vm.hal:113`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/tool/vm.hal" "tool.vm/fail" 0]`
- **Role:** `:production`
- **Definition:** `tool.vm/fail`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
message
```

### Legacy form

```clojure
(ex-info message data)
```

### Enclosing definition

```clojure
(defn- fail [message data]
  (throw (ex-info message data)))
```

---

## 119. hara-lang/hara — `core/lib/src/work/agent.hal:291`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/agent.hal" "work.agent/step" 0]`
- **Role:** `:production`
- **Definition:** `work.agent/step`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Agent run is already advancing"
```

### Legacy form

```clojure
(ex-info "Agent run is already advancing"
                {:run/id (:run/id run)
                 :run/status status})
```

### Enclosing definition

```clojure
(defn step
  "Advances one model turn and any function calls requested by that response.

   The return value is a direct state snapshot or a Promise of one."
  [host reference]
  (let [run (run-record host reference)
        status (:run/status run)]
    (cond
      (not (nil? (get terminal-statuses status)))
      (public-state run)

      (not= :ready status)
      (throw
       (ex-info "Agent run is already advancing"
                {:run/id (:run/id run)
                 :run/status status}))

      (>= (:run/turn run) (:run/max-turns run))
      (public-state
       (mark-failed
        host
        reference
        (ex-info "Agent turn limit reached"
                 {:run/turn (:run/turn run)
                  :run/max-turns (:run/max-turns run)})))

      :else
      (do
        (transition
         host
         reference
         (fn [run]
           (assoc run :run/status :calling-model))
         :agent/model-started
         {:turn (inc (:run/turn run))})
        (async-result/attempt
         (fn []
           (async-result/then
            (openai/complete
             (:run/client run)
             {:instructions (:run/instructions run)
              :tools (:run/tools run)
              :input (:run/input run)
              :request (:run/request run)})
            (fn [response]
              (process-response host reference response))))
         (fn [error]
           (public-state (mark-failed host reference error))))))))
```

---

## 120. hara-lang/hara — `core/lib/src/work/agent.hal:348`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/agent.hal" "work.agent/send" 0]`
- **Role:** `:production`
- **Definition:** `work.agent/send`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cannot redirect this agent run"
```

### Legacy form

```clojure
(ex-info "Cannot redirect this agent run"
                {:run/id (:run/id run)
                 :run/status status})
```

### Enclosing definition

```clojure
(defn send
  "Appends a human message to a ready or completed run.

   Completed and failed runs become ready again with their prior transcript."
  [host reference message]
  (let [run (run-record host reference)
        status (:run/status run)]
    (if (or (= :calling-model status)
            (= :running-tools status)
            (= :cancelled status))
      (throw
       (ex-info "Cannot redirect this agent run"
                {:run/id (:run/id run)
                 :run/status status})))
    (public-state
     (transition
      host
      reference
      (fn [run]
        (assoc
         (assoc
          (assoc
           (assoc run :run/status :ready)
           :run/result nil)
          :run/error nil)
         :run/input
         (conj (:run/input run)
               (openai/input-message message))))
      :agent/message-added
      {}))))
```

---

## 121. hara-lang/hara — `core/lib/src/work/agent.hal:391`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/agent.hal" "work.agent/ask" 0]`
- **Role:** `:production`
- **Definition:** `work.agent/ask`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Agent did not complete"
```

### Legacy form

```clojure
(ex-info "Agent did not complete"
                   snapshot)
```

### Enclosing definition

```clojure
(defn ask
  "Runs one isolated agent request and returns its final response text."
  [options input]
  (let [runtime (host)
        reference (start runtime options input)]
    (async-result/then
     (run runtime reference)
     (fn [snapshot]
       (if (= :completed (:run/status snapshot))
         (:run/result snapshot)
         (throw
          (ex-info "Agent did not complete"
                   snapshot)))))))
```

---

## 122. hara-lang/hara — `core/lib/src/work/base.hal:381`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base.hal" "work.base/emit" 0]`
- **Role:** `:production`
- **Definition:** `work.base/emit`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work event emission is not available in this context"
```

### Legacy form

```clojure
(ex-info "Work event emission is not available in this context"
                 {:event event})
```

### Enclosing definition

```clojure
(defn emit
  "Appends one structured domain event through the active work runtime."
  ([context event]
   (emit context event {}))
  ([context event data]
   (let [emitter (:work/emit context)]
     (if emitter
       (emitter event data)
       (throw
        (ex-info "Work event emission is not available in this context"
                 {:event event}))))))
```

---

## 123. hara-lang/hara — `core/lib/src/work/base/coordinator.hal:249`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/coordinator.hal" "work.base.coordinator/resume-run" 1]`
- **Role:** `:production`
- **Definition:** `work.base.coordinator/resume-run`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Pinned work definition is not available"
```

### Legacy form

```clojure
(ex-info "Pinned work definition is not available"
                         {:work/root (:run/work-root run)
                          :work/version (:run/work-version run)})
```

### Enclosing definition

```clojure
(defn resume-run
  [runtime reference options]
  (let [id (base/reference-id reference)]
    (result/then
     (store/query (base/runtime-store runtime)
                  {:work/query :run/load :run/id id})
     (fn [run]
       (if (nil? run)
         (throw (ex-info "Work run does not exist" {:run/id id}))
         (if (or (= :completed (:run/status run))
                 (= :cancelled (:run/status run)))
           (base/work-reference id)
           (let [work
                 (base/resolve-definition runtime
                                          (:run/work-root run)
                                          (:run/work-version run))]
             (if (nil? work)
               (throw
                (ex-info "Pinned work definition is not available"
                         {:work/root (:run/work-root run)
                          :work/version (:run/work-version run)}))
               (execute-run runtime
                             run
                             work
                             (merge (or (:run/options run) {})
                                    (or options {})
                                    {:work-root (:run/work-root run)
                                     :work-version
                                     (:run/work-version run)}))))))))))
```

---

## 124. hara-lang/hara — `core/lib/src/work/base/coordinator.hal:311`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/coordinator.hal" "work.base.coordinator/selected-checkpoint" 0]`
- **Role:** `:production`
- **Definition:** `work.base.coordinator/selected-checkpoint`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Fork checkpoint selector is ambiguous"
```

### Legacy form

```clojure
(ex-info "Fork checkpoint selector is ambiguous"
                        {:checkpoint selected})
```

### Enclosing definition

```clojure
(defn selected-checkpoint
  [checkpoints selected]
  (let [checkpoints (vec checkpoints)]
    (loop [index 0
           match nil]
      (if (= index (count checkpoints))
        match
        (let [checkpoint (nth checkpoints index)]
          (if (checkpoint-selected? checkpoint selected)
            (if match
              (throw
               (ex-info "Fork checkpoint selector is ambiguous"
                        {:checkpoint selected}))
              (recur (inc index) checkpoint))
            (recur (inc index) match)))))))
```

---

## 125. hara-lang/hara — `core/lib/src/work/base/coordinator.hal:423`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/coordinator.hal" "work.base.coordinator/fork-source-run" 0]`
- **Role:** `:production`
- **Definition:** `work.base.coordinator/fork-source-run`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Pinned work definition is not available"
```

### Legacy form

```clojure
(ex-info "Pinned work definition is not available"
                {:work/root (:run/work-root source)
                 :work/version (:run/work-version source)})
```

### Enclosing definition

```clojure
(defn fork-source-run
  [runtime source source-id options]
  (let [work
        (base/resolve-definition runtime
                                 (:run/work-root source)
                                 (:run/work-version source))
        fork-options
        (merge (or (:run/options source) {})
               options
               {:work-root (:run/work-root source)
                :work-version (:run/work-version source)})]
    (if (nil? work)
      (throw
       (ex-info "Pinned work definition is not available"
                {:work/root (:run/work-root source)
                 :work/version (:run/work-version source)})))
    (result/then
     (requested-run-id runtime options)
     (fn [id]
       (fork-run-with-id runtime
                         source
                         source-id
                         id
                         work
                         fork-options
                         options)))))
```

---

## 126. hara-lang/hara — `core/lib/src/work/base/execution.hal:35`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/execution.hal" "work.base.execution/assert-role" 0]`
- **Role:** `:production`
- **Definition:** `work.base.execution/assert-role`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work provider does not have the executor role"
```

### Legacy form

```clojure
(ex-info "Work provider does not have the executor role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})
```

### Enclosing definition

```clojure
(defn assert-role
  [provider]
  (if (not= :work/executor (:provider/role provider))
    (throw
     (ex-info "Work provider does not have the executor role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})))
  provider)
```

---

## 127. hara-lang/hara — `core/lib/src/work/base/execution.hal:85`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/execution.hal" "work.base.execution/normalise-provider" 1]`
- **Role:** `:production`
- **Definition:** `work.base.execution/normalise-provider`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work executor must implement IWorkExecutor or be a legacy provider"
```

### Legacy form

```clojure
(ex-info "Work executor must implement IWorkExecutor or be a legacy provider"
              {:provider provider})
```

### Enclosing definition

```clojure
(defn normalise-provider
  [provider]
  (cond
    (nil? provider)
    (throw (ex-info "Work runtime requires an executor provider" {}))

    (satisfies? IWorkExecutor provider)
    provider

    (and (map? provider)
         (= :work/executor (:provider/role provider)))
    (work.base.execution/LegacyExecutor (validate-provider provider) true)

    (and (map? provider)
         (:provider/role provider))
    (assert-role provider)

    (map? provider)
    (work.base.execution/LegacyExecutor
     (validate-provider (legacy-provider provider))
     true)

    :else
    (throw
     (ex-info "Work executor must implement IWorkExecutor or be a legacy provider"
              {:provider provider}))))
```

---

## 128. hara-lang/hara — `core/lib/src/work/base/execution.hal:106`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/execution.hal" "work.base.execution/call" 0]`
- **Role:** `:production`
- **Definition:** `work.base.execution/call`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work executor operation is not installed"
```

### Legacy form

```clojure
(ex-info "Work executor operation is not installed"
                {:provider/id (:provider/id provider)
                 :operation operation})
```

### Enclosing definition

```clojure
(defn call
  [provider operation & arguments]
  (let [function (get (provider-operations provider) operation)]
    (if function
      (apply function arguments)
      (throw
       (ex-info "Work executor operation is not installed"
                {:provider/id (:provider/id provider)
                 :operation operation})))))
```

---

## 129. hara-lang/hara — `core/lib/src/work/base/frame.hal:177`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/frame.hal" "work.base.frame/assert-running" 0]`
- **Role:** `:production`
- **Definition:** `work.base.frame/assert-running`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work run has been cancelled"
```

### Legacy form

```clojure
(ex-info "Work run has been cancelled" {:run/id (:run/id frame)})
```

### Enclosing definition

```clojure
(defn assert-running
  [runtime frame]
  (if (and (native-runtime? runtime)
           (not (:work/cleanup? frame)))
    (native/check-cancelled)
    (result/then
     (cancelled? runtime frame)
     (fn [cancelled]
       (if (and (not (:work/cleanup? frame)) cancelled)
         (throw
          (ex-info "Work run has been cancelled" {:run/id (:run/id frame)})))
       nil))))
```

---

## 130. hara-lang/hara — `core/lib/src/work/base/host.hal:91`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/host.hal" "work.base.host/validate-provider" 2]`
- **Role:** `:production`
- **Definition:** `work.base.host/validate-provider`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work host provider API is not supported"
```

### Legacy form

```clojure
(ex-info "Work host provider API is not supported"
              {:work/error :work/unsupported-host-api
               :provider/api (:provider/api provider)})
```

### Enclosing definition

```clojure
(defn validate-provider
  [provider locator]
  (if (not (map? provider))
    (throw
     (ex-info "Work host provider must be a descriptor map"
              {:work/error :work/invalid-host-provider})))
  (if (not= :work/host (:provider/role provider))
    (throw
     (ex-info "Work provider does not have the host role"
              {:work/error :work/invalid-host-provider
               :provider/role (:provider/role provider)})))
  (if (not= host-api (:provider/api provider))
    (throw
     (ex-info "Work host provider API is not supported"
              {:work/error :work/unsupported-host-api
               :provider/api (:provider/api provider)})))
  (let [missing (missing-operations provider)]
    (if (not (empty? missing))
      (throw
       (ex-info "Work host provider is missing required operations"
                {:work/error :work/invalid-host-provider
                 :provider/missing missing}))))
  (let [provider-locator
        (normalise-locator
         (or (:provider/locator provider) locator))]
    (if (not= locator provider-locator)
      (throw
       (ex-info "Work host provider locator does not match its host"
                {:work/error :work/host-mismatch
                 :host/locator locator
                 :provider/locator provider-locator}))))
  provider)
```

---

## 131. hara-lang/hara — `core/lib/src/work/base/host.hal:105`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/host.hal" "work.base.host/validate-provider" 4]`
- **Role:** `:production`
- **Definition:** `work.base.host/validate-provider`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work host provider locator does not match its host"
```

### Legacy form

```clojure
(ex-info "Work host provider locator does not match its host"
                {:work/error :work/host-mismatch
                 :host/locator locator
                 :provider/locator provider-locator})
```

### Enclosing definition

```clojure
(defn validate-provider
  [provider locator]
  (if (not (map? provider))
    (throw
     (ex-info "Work host provider must be a descriptor map"
              {:work/error :work/invalid-host-provider})))
  (if (not= :work/host (:provider/role provider))
    (throw
     (ex-info "Work provider does not have the host role"
              {:work/error :work/invalid-host-provider
               :provider/role (:provider/role provider)})))
  (if (not= host-api (:provider/api provider))
    (throw
     (ex-info "Work host provider API is not supported"
              {:work/error :work/unsupported-host-api
               :provider/api (:provider/api provider)})))
  (let [missing (missing-operations provider)]
    (if (not (empty? missing))
      (throw
       (ex-info "Work host provider is missing required operations"
                {:work/error :work/invalid-host-provider
                 :provider/missing missing}))))
  (let [provider-locator
        (normalise-locator
         (or (:provider/locator provider) locator))]
    (if (not= locator provider-locator)
      (throw
       (ex-info "Work host provider locator does not match its host"
                {:work/error :work/host-mismatch
                 :host/locator locator
                 :provider/locator provider-locator}))))
  provider)
```

---

## 132. hara-lang/hara — `core/lib/src/work/base/model.hal:103`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/model.hal" ":top-level" 0]`
- **Role:** `:production`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work value is not directly callable"
```

### Legacy form

```clojure
(ex-info
          "Work value is not directly callable"
          {:work/id (:id (:spec work))})
```

### Enclosing definition

```clojure
—
```

---

## 133. hara-lang/hara — `core/lib/src/work/base/model.hal:130`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/model.hal" "work.base.model/work-spec-map" 1]`
- **Role:** `:production`
- **Definition:** `work.base.model/work-spec-map`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"IWork/work-spec must return a map"
```

### Legacy form

```clojure
(ex-info "IWork/work-spec must return a map"
                    {:work work
                     :spec spec})
```

### Enclosing definition

```clojure
(defn work-spec-map
  [work]
  (if (and (map? work)
           (has? work :op))
    work
    (if (nil? work)
      (throw (ex-info "Work value cannot be nil" {}))
      (let [spec (IWork/work-spec work)]
        (if (map? spec)
          spec
          (throw
           (ex-info "IWork/work-spec must return a map"
                    {:work work
                     :spec spec})))))))
```

---

## 134. hara-lang/hara — `core/lib/src/work/base/model.hal:182`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/model.hal" "work.base.model/backend-call" 0]`
- **Role:** `:production`
- **Definition:** `work.base.model/backend-call`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work backend operation is not installed"
```

### Legacy form

```clojure
(ex-info "Work backend operation is not installed"
                {:operation operation})
```

### Enclosing definition

```clojure
(defn backend-call
  "Deprecated compatibility dispatch for legacy backend maps."
  [backend operation & arguments]
  (let [operations (or (:provider/operations backend) backend)
        function (get operations operation)]
    (if function
      (apply function arguments)
      (throw
       (ex-info "Work backend operation is not installed"
                {:operation operation})))))
```

---

## 135. hara-lang/hara — `core/lib/src/work/base/receipt.hal:27`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/receipt.hal" "work.base.receipt/assert-role" 0]`
- **Role:** `:production`
- **Definition:** `work.base.receipt/assert-role`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work provider does not have the receipt role"
```

### Legacy form

```clojure
(ex-info "Work provider does not have the receipt role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})
```

### Enclosing definition

```clojure
(defn assert-role
  [provider]
  (if (not= :work/receipt (:provider/role provider))
    (throw
     (ex-info "Work provider does not have the receipt role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})))
  provider)
```

---

## 136. hara-lang/hara — `core/lib/src/work/base/store.hal:58`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/store.hal" "work.base.store/adapter-query" 0]`
- **Role:** `:production`
- **Definition:** `work.base.store/adapter-query`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work store query is not supported"
```

### Legacy form

```clojure
(ex-info "Work store query is not supported"
                {:work/query (:work/query query)})
```

### Enclosing definition

```clojure
(defn adapter-query
  [store query]
  (let [operation (get query-operations (:work/query query))
        function (get (:operations store) operation)]
    (if (nil? operation)
      (throw
       (ex-info "Work store query is not supported"
                {:work/query (:work/query query)})))
    (if (nil? function)
      (throw
       (ex-info "Work store query operation is not installed"
                {:work/query (:work/query query)
                 :provider/id (:provider/id (:descriptor store))
                 :operation operation})))
    (apply function (query-arguments query))))
```

---

## 137. hara-lang/hara — `core/lib/src/work/base/store.hal:62`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/store.hal" "work.base.store/adapter-query" 1]`
- **Role:** `:production`
- **Definition:** `work.base.store/adapter-query`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work store query operation is not installed"
```

### Legacy form

```clojure
(ex-info "Work store query operation is not installed"
                {:work/query (:work/query query)
                 :provider/id (:provider/id (:descriptor store))
                 :operation operation})
```

### Enclosing definition

```clojure
(defn adapter-query
  [store query]
  (let [operation (get query-operations (:work/query query))
        function (get (:operations store) operation)]
    (if (nil? operation)
      (throw
       (ex-info "Work store query is not supported"
                {:work/query (:work/query query)})))
    (if (nil? function)
      (throw
       (ex-info "Work store query operation is not installed"
                {:work/query (:work/query query)
                 :provider/id (:provider/id (:descriptor store))
                 :operation operation})))
    (apply function (query-arguments query))))
```

---

## 138. hara-lang/hara — `core/lib/src/work/base/store.hal:126`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/store.hal" "work.base.store/assert-role" 0]`
- **Role:** `:production`
- **Definition:** `work.base.store/assert-role`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work provider does not have the store role"
```

### Legacy form

```clojure
(ex-info "Work provider does not have the store role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})
```

### Enclosing definition

```clojure
(defn assert-role
  [provider]
  (if (not= :work/store (:provider/role provider))
    (throw
     (ex-info "Work provider does not have the store role"
              {:provider/role (:provider/role provider)
               :provider/id (:provider/id provider)})))
  provider)
```

---

## 139. hara-lang/hara — `core/lib/src/work/base/store.hal:206`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/store.hal" "work.base.store/normalise-provider" 1]`
- **Role:** `:production`
- **Definition:** `work.base.store/normalise-provider`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work store must implement IWorkStore or be a legacy provider"
```

### Legacy form

```clojure
(ex-info "Work store must implement IWorkStore or be a legacy provider"
              {:provider provider})
```

### Enclosing definition

```clojure
(defn normalise-provider
  [provider]
  (cond
    (nil? provider)
    (throw (ex-info "Work runtime requires a store provider" {}))

    (satisfies? IWorkStore provider)
    provider

    (and (map? provider)
         (= :work/store (:provider/role provider)))
    (adapt-provider provider)

    (and (map? provider)
         (:provider/role provider))
    (assert-role provider)

    (map? provider)
    (adapt-provider (legacy-provider provider))

    :else
    (throw
     (ex-info "Work store must implement IWorkStore or be a legacy provider"
              {:provider provider}))))
```

---

## 140. hara-lang/hara — `core/lib/src/work/base/store.hal:234`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/base/store.hal" "work.base.store/call" 0]`
- **Role:** `:production`
- **Definition:** `work.base.store/call`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work store compatibility operation is not installed"
```

### Legacy form

```clojure
(ex-info "Work store compatibility operation is not installed"
                {:provider/id (:provider/id (descriptor provider))
                 :operation operation})
```

### Enclosing definition

```clojure
(defn call
  "Compatibility access for optional suites and deprecated callers."
  [provider operation & arguments]
  (let [function (get (operations provider) operation)]
    (if function
      (apply function arguments)
      (throw
       (ex-info "Work store compatibility operation is not installed"
                {:provider/id (:provider/id (descriptor provider))
                 :operation operation})))))
```

---

## 141. hara-lang/hara — `core/lib/src/work/flow/make/bulk.hal:30`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/make/bulk.hal" "work.flow.make.bulk/topological-order" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.make.bulk/topological-order`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Cyclic bulk dependencies"
```

### Legacy form

```clojure
(ex-info "Cyclic bulk dependencies"
                          {:graph remaining :ordered ordered})
```

### Enclosing definition

```clojure
(defn- topological-order [actions]
  (loop [remaining (map-values
                    (fn [action] (set (or (:deps action) [])))
                    actions)
         ordered []]
    (if (empty? remaining)
      ordered
      (let [ready (vec (filter (fn [key]
                                 (empty? (get remaining key)))
                               (keys remaining)))]
        (if (empty? ready)
          (throw (ex-info "Cyclic bulk dependencies"
                          {:graph remaining :ordered ordered}))
          (let [ready-set (set ready)
                next-remaining
                (reduce-kv
                 (fn [output key dependencies]
                   (if (has? ready-set key)
                     output
                     (assoc output key (difference dependencies ready-set))))
                 {}
                 remaining)]
            (recur next-remaining (vec (concat ordered ready)))))))))
```

---

## 142. hara-lang/hara — `core/lib/src/work/flow/make/compile.hal:63`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/make/compile.hal" "work.flow.make.compile/assert-entry-compiler" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.make.compile/assert-entry-compiler`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Make entry has no compiler"
```

### Legacy form

```clojure
(ex-info "Make entry has no compiler"
                {:make/id (:make/id definition)
                 :make/target target
                 :make/index index
                 :make/entry entry})
```

### Enclosing definition

```clojure
(defn assert-entry-compiler
  [definition target entry index]
  (let [function (entry-compiler definition entry)]
    (if (not (fn? function))
      (throw
       (ex-info "Make entry has no compiler"
                {:make/id (:make/id definition)
                 :make/target target
                 :make/index index
                 :make/entry entry})))
    function))
```

---

## 143. hara-lang/hara — `core/lib/src/work/flow/make/compile.hal:234`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/make/compile.hal" "work.flow.make.compile/target-work" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.make.compile/target-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Make target is not defined"
```

### Legacy form

```clojure
(ex-info "Make target is not defined"
                {:make/id (:make/id plan)
                 :make/target target
                 :make/available (vec (keys specs))})
```

### Enclosing definition

```clojure
(defn target-work
  "Returns the work graph for a target or a filtered [target selector]."
  [plan directive]
  (let [parts (directive-parts directive)
        target (nth parts 0)
        selector (nth parts 1)
        specs (:make/target-specs plan)
        spec (get specs target)]
    (if (nil? spec)
      (throw
       (ex-info "Make target is not defined"
                {:make/id (:make/id plan)
                 :make/target target
                 :make/available (vec (keys specs))})))
    (if (nil? selector)
      (get (:make/targets plan) target)
      (compile-target (:make/definition plan)
                      target
                      (select-spec spec selector)))))
```

---

## 144. hara-lang/hara — `core/lib/src/work/flow/make/github.hal:103`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/make/github.hal" "work.flow.make.github/gh-refresh" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.make.github/gh-refresh`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"TODO"
```

### Legacy form

```clojure
(ex-info "TODO" {:config config})
```

### Enclosing definition

```clojure
(defn gh-refresh [config]
  (throw (ex-info "TODO" {:config config})))
```

---

## 145. hara-lang/hara — `core/lib/src/work/flow/task/engine.hal:191`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/task/engine.hal" "work.flow.task.engine/invocation-arguments" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.task.engine/invocation-arguments`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Task invocation accepts at most input, params, lookup, and environment"
```

### Legacy form

```clojure
(ex-info
            "Task invocation accepts at most input, params, lookup, and environment"
            {:arguments task-arguments})
```

### Enclosing definition

```clojure
(defn invocation-arguments
  "Restores the historical task call convention for zero to four arguments.
   A map in the single-argument position is params over constructed input.
   Values following :args are forwarded to the task main function."
  [arguments]
  (let [marker
        (loop [index 0]
          (if (= index (count arguments))
            -1
            (if (= :args (nth arguments index))
              index
              (recur (inc index)))))
        task-arguments
        (if (= marker -1)
          arguments
          (vec (take marker arguments)))
        additional
        (if (= marker -1)
          []
          (vec (drop (inc marker) arguments)))
        total (count task-arguments)
        options
        (case total
          0 {}
          1 (let [value (first task-arguments)]
              (if (map? value)
                {:params value}
                {:input value}))
          2 {:input (nth task-arguments 0)
             :params (nth task-arguments 1)}
          3 {:input (nth task-arguments 0)
             :params (nth task-arguments 1)
             :environment (nth task-arguments 2)}
          4 {:input (nth task-arguments 0)
             :params (nth task-arguments 1)
             :lookup (nth task-arguments 2)
             :environment (nth task-arguments 3)}
          (throw
           (ex-info
            "Task invocation accepts at most input, params, lookup, and environment"
            {:arguments task-arguments})))]
    (request
     (if (empty? additional)
       options
       (assoc options :args additional)))))
```

---

## 146. hara-lang/hara — `core/lib/src/work/flow/task/engine.hal:486`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/task/engine.hal" "work.flow.task.engine/list-values" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.task.engine/list-values`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Task item list mode is not supported"
```

### Legacy form

```clojure
(ex-info "Task item list mode is not supported"
                  {:task/id (:task/id definition)
                   :list-mode list-mode})
```

### Enclosing definition

```clojure
(defn list-values
  [definition prepared context]
  (let [item (:item definition)
        list-function (:list item)
        list-mode (:list-mode item)]
    (if list-function
      (case list-mode
        :lookup-environment
        (list-function
         (:task/lookup prepared)
         (:task/environment prepared))

        :input-context
        (list-function (:task/input prepared) context)

        (throw
         (ex-info "Task item list mode is not supported"
                  {:task/id (:task/id definition)
                   :list-mode list-mode})))
      [(:task/input prepared)])))
```

---

## 147. hara-lang/hara — `core/lib/src/work/flow/task/report.hal:69`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/flow/task/report.hal" "work.flow.task.report/section" 0]`
- **Role:** `:production`
- **Definition:** `work.flow.task.report/section`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work report section kind is not supported"
```

### Legacy form

```clojure
(ex-info "Work report section kind is not supported"
               {:section/id id
                :section/kind kind})
```

### Enclosing definition

```clojure
(defn section
  ([id kind entries]
   (section id kind entries {}))
  ([id kind entries options]
   (if (not (contains-value? section-kinds kind))
     (throw
      (ex-info "Work report section kind is not supported"
               {:section/id id
                :section/kind kind})))
   (merge
    {:section/id id
     :section/kind kind
     :section/entries (vec (or entries []))}
    (or options {}))))
```

---

## 148. hara-lang/hara — `core/lib/src/work/playground.hal:20`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/playground.hal" "work-playground/execute-pure" 0]`
- **Role:** `:production`
- **Definition:** `work-playground/execute-pure`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported playground operation"
```

### Legacy form

```clojure
(ex-info "Unsupported playground operation"
               {:operation (:op spec)})
```

### Enclosing definition

```clojure
(defn execute-pure
  [definition input]
  (let [spec (work/work-spec definition)]
    (cond
     (= :pure (:op spec))
     ((:fn spec)
      input
      {:run (work.native/current-run)
       :cancelled? work.native/cancelled?
       :deadline-nanos (work.native/deadline-nanos)})
     (= :chain (:op spec))
     (reduce execute-pure input (:children spec))
     :else
     (throw
      (ex-info "Unsupported playground operation"
               {:operation (:op spec)})))))
```

---

## 149. hara-lang/hara — `core/lib/src/work/provider/memory.hal:433`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/provider/memory.hal" "work.provider.memory/memory-ack-outbox" 1]`
- **Role:** `:production`
- **Definition:** `work.provider.memory/memory-ack-outbox`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Outbox acknowledgement claim does not match"
```

### Legacy form

```clojure
(ex-info "Outbox acknowledgement claim does not match"
                               {:outbox/id id
                                :claim/id (:claim/id options)
                                :outbox/claim-id (:outbox/claim-id entry)})
```

### Enclosing definition

```clojure
(defn memory-ack-outbox
  [state id options]
  (let [options (or options {})
        updated
        (swap! state
               (fn [data]
                 (let [entry (get-in data [:outbox id])]
                   (if (nil? entry)
                     (throw
                      (ex-info "Outbox entry does not exist"
                               {:outbox/id id})))
                   (if (and (:claim/id options)
                            (:outbox/claim-id entry)
                            (not= (:claim/id options)
                                  (:outbox/claim-id entry)))
                     (throw
                      (ex-info "Outbox acknowledgement claim does not match"
                               {:outbox/id id
                                :claim/id (:claim/id options)
                                :outbox/claim-id (:outbox/claim-id entry)})))
                   (let [record
                         (if (= :acked (:outbox/status entry))
                           entry
                           (assoc entry
                                  :outbox/status :acked
                                  :outbox/ack (or (:ack/data options) {})))]
                     (assoc
                      (assoc-in data [:outbox id] record)
                      :last-ack record)))))]
    (:last-ack updated)))
```

---

## 150. hara-lang/hara — `core/lib/src/work/provider/model.hal:67`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/provider/model.hal" "work.provider.model/assert-status-transition" 0]`
- **Role:** `:production`
- **Definition:** `work.provider.model/assert-status-transition`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Work run status transition is not allowed"
```

### Legacy form

```clojure
(ex-info "Work run status transition is not allowed"
                {:run/id (:run/id run)
                 :run/status current
                 :run/proposed-status proposed})
```

### Enclosing definition

```clojure
(defn assert-status-transition
  [run updates]
  (let [current (:run/status run)
        proposed (or (:run/status updates) current)
        allowed (get status-transitions current)]
    (if (not (contains-value? allowed proposed))
      (throw
       (ex-info "Work run status transition is not allowed"
                {:run/id (:run/id run)
                 :run/status current
                 :run/proposed-status proposed}))))
  run)
```

---

## 151. hara-lang/hara — `core/lib/src/work/provider/model.hal:90`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/src/work/provider/model.hal" "work.provider.model/assert-checkpoint-run" 0]`
- **Role:** `:production`
- **Definition:** `work.provider.model/assert-checkpoint-run`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Checkpoint belongs to another work run"
```

### Legacy form

```clojure
(ex-info "Checkpoint belongs to another work run"
                {:run/id run-id
                 :checkpoint/run checkpoint-run
                 :checkpoint/key (:checkpoint/key checkpoint)})
```

### Enclosing definition

```clojure
(defn assert-checkpoint-run
  [run-id checkpoint]
  (let [checkpoint-run (:checkpoint/run checkpoint)]
    (if (and checkpoint-run (not= checkpoint-run run-id))
      (throw
       (ex-info "Checkpoint belongs to another work run"
                {:run/id run-id
                 :checkpoint/run checkpoint-run
                 :checkpoint/key (:checkpoint/key checkpoint)}))))
  checkpoint)
```

---

## 152. hara-lang/hara — `core/lib/test-lang/lang/common/compiler_test.hal:183`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test-lang/lang/common/compiler_test.hal" ":top-level" 0]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"lint exploded"
```

### Legacy form

```clojure
(ex-info "lint exploded" {:probe true})
```

### Enclosing definition

```clojure
—
```

---

## 153. hara-lang/hara — `core/lib/test/code/test_reporting_test.hal:31`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/code/test_reporting_test.hal" ":top-level" 0]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {:id 1})
```

### Enclosing definition

```clojure
—
```

---

## 154. hara-lang/hara — `core/lib/test/code/test_result_execution_test.hal:11`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/code/test_result_execution_test.hal" ":top-level" 0]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {:id 1})
```

### Enclosing definition

```clojure
—
```

---

## 155. hara-lang/hara — `core/lib/test/code/test_result_execution_test.hal:14`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/code/test_result_execution_test.hal" ":top-level" 1]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {:id 1})
```

### Enclosing definition

```clojure
—
```

---

## 156. hara-lang/hara — `core/lib/test/code/test_result_execution_test.hal:17`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/code/test_result_execution_test.hal" ":top-level" 2]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {})
```

### Enclosing definition

```clojure
—
```

---

## 157. hara-lang/hara — `core/lib/test/code/test_result_execution_test.hal:30`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/code/test_result_execution_test.hal" ":top-level" 3]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {:id 1})
```

### Enclosing definition

```clojure
—
```

---

## 158. hara-lang/hara — `core/lib/test/std/foundation_test_primitives_test.hal:11`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/foundation_test_primitives_test.hal" "std.foundation-test-primitives-test/thrown" 0]`
- **Role:** `:test`
- **Definition:** `std.foundation-test-primitives-test/thrown`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"boom"
```

### Legacy form

```clojure
(ex-info "boom" {:kind :test})
```

### Enclosing definition

```clojure
(def thrown
  (test-check
   "inner throw"
   (do
     (swap! evaluations inc)
     (throw (ex-info "boom" {:kind :test})))
   :never))
```

---

## 159. hara-lang/hara — `core/lib/test/std/work_cleanup_test.hal:95`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/work_cleanup_test.hal" "std.work-cleanup-test/double-failure-work" 0]`
- **Role:** `:test`
- **Definition:** `std.work-cleanup-test/double-failure-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"body failure"
```

### Legacy form

```clojure
(ex-info "body failure" {})
```

### Enclosing definition

```clojure
(def double-failure-work
  (work/ensure
   {:id :double-failure-scope
    :version 1}
   (work/step :double-failure-body
     (fn [input context]
       (throw (ex-info "body failure" {}))))
   (work/step :double-failure-cleanup
     (fn [outcome context]
       (throw (ex-info "cleanup failure" {}))))))
```

---

## 160. hara-lang/hara — `core/lib/test/std/work_cleanup_test.hal:98`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/work_cleanup_test.hal" "std.work-cleanup-test/double-failure-work" 1]`
- **Role:** `:test`
- **Definition:** `std.work-cleanup-test/double-failure-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"cleanup failure"
```

### Legacy form

```clojure
(ex-info "cleanup failure" {})
```

### Enclosing definition

```clojure
(def double-failure-work
  (work/ensure
   {:id :double-failure-scope
    :version 1}
   (work/step :double-failure-body
     (fn [input context]
       (throw (ex-info "body failure" {}))))
   (work/step :double-failure-cleanup
     (fn [outcome context]
       (throw (ex-info "cleanup failure" {}))))))
```

---

## 161. hara-lang/hara — `core/lib/test/std/work_receipt_test.hal:64`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/work_receipt_test.hal" "std.work-receipt-test/fake-provider" 1]`
- **Role:** `:test`
- **Definition:** `std.work-receipt-test/fake-provider`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"transient fake publisher outage"
```

### Legacy form

```clojure
(ex-info "transient fake publisher outage"
                          {:receipt/id id})
```

### Enclosing definition

```clojure
(defn fake-provider
  [provider-id state fail-first-create?]
  {:provider/role :work/receipt
   :provider/id provider-id
   :provider/capabilities #{:idempotent :retryable}
   :provider/retry {:maximum-attempts 2}
   :provider/operations
   {:publish
    (fn [envelope]
      (let [id (:receipt/id envelope)
            current (deref state)
            existing (get-in current [:payloads id])
            attempt (inc (or (get-in current [:attempts id]) 0))]
        (if (and existing (not= existing envelope))
          (throw
           (ex-info "fake publisher idempotency conflict"
                    {:receipt/id id})))
        (swap!
         state
         (fn [data]
           (assoc-in
            (assoc-in data [:payloads id] envelope)
            [:attempts id]
            attempt)))
        (if (and fail-first-create?
                 (= :work/run-created (:receipt/kind envelope))
                 (= 1 attempt))
          (throw (ex-info "transient fake publisher outage"
                          {:receipt/id id}))
          (do
            (swap!
             state
             (fn [data]
               (if (contains-value? (:published data) id)
                 data
                 (assoc data
                        :published
                        (conj (vec (or (:published data) [])) id)))))
            {:receipt/status :published
             :provider/receipt-root [:fake/receipt id]}))))}})
```

---

## 162. hara-lang/hara — `core/lib/test/std/work_test.hal:76`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/work_test.hal" "std.work-test/recovery-work" 0]`
- **Role:** `:test`
- **Definition:** `std.work-test/recovery-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"interrupted before checkpoint"
```

### Legacy form

```clojure
(ex-info "interrupted before checkpoint" {})
```

### Enclosing definition

```clojure
(def recovery-work
  (work/chain
   {:id :recovery-work
    :version 1}
   [(work/step :prepare
      (fn [value context]
        (swap! prepare-count inc)
        (inc value)))
    (work/pure :replay-shape
      (fn [value context]
        (swap! replay-count inc)
        (* 2 value)))
    (work/step
      {:id :finish
       :retry {:maximum 1}}
      (fn [value context]
        (let [attempt (swap! finish-count inc)]
          (if (= attempt 1)
            (throw (ex-info "interrupted before checkpoint" {}))
            (+ value 3)))))]))
```

---

## 163. hara-lang/hara — `core/lib/test/std/work_test.hal:159`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/std/work_test.hal" "std.work-test/maintenance-work" 0]`
- **Role:** `:test`
- **Definition:** `std.work-test/maintenance-work`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"inspection worker interrupted"
```

### Legacy form

```clojure
(ex-info "inspection worker interrupted" {})
```

### Enclosing definition

```clojure
(def maintenance-work
  (work/batch
   {:id :code-maintenance-v1
    :version 1}
   {:list
    (work/step :list-code-units
      (fn [project context]
        (swap! list-count inc)
        [{:item/id 'code.manage
          :item/value {:name 'code.manage}}
         {:item/id 'code.framework
          :item/value {:name 'code.framework}}]))

    :filter
    (work/pure :selected-code-unit?
      (fn [subject context]
        (swap! filter-count inc)
        true))

    :process
    (work/step
      {:id :inspect-code-unit
       :retry {:maximum 1}}
      (fn [subject context]
        (if (= 'code.manage (:name subject))
          (do
            (swap! manage-count inc)
            {:name (:name subject)
             :status :ok})
          (let [attempt (swap! framework-count inc)]
            (if (= attempt 1)
              (throw (ex-info "inspection worker interrupted" {}))
              {:name (:name subject)
               :status :ok})))))

    :summarise
    (work/pure :summarise-findings
      (fn [batch context]
        (swap! summary-count inc)
        {:processed (count (:results batch))
         :ids (vec (map (fn [item] (:item/id item))
                        (:results batch)))}))}))
```

---

## 164. hara-lang/hara — `core/lib/test/tool/cli/template_test.hal:106`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/tool/cli/template_test.hal" ":top-level" 0]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"template exception"
```

### Legacy form

```clojure
(ex-info "template exception" {})
```

### Enclosing definition

```clojure
—
```

---

## 165. hara-lang/hara — `core/lib/test/work/eval_test.hal:102`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/lib/test/work/eval_test.hal" ":top-level" 0]`
- **Role:** `:test`
- **Definition:** `—`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"retry"
```

### Legacy form

```clojure
(ex-info "retry" {:work/error :temporary})
```

### Enclosing definition

```clojure
—
```

---

## 166. hara-lang/hara — `core/rust/hal-src/code/translate/rule.hal:82`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/rust/hal-src/code/translate/rule.hal" "code.translate.rule/compile-rules" 1]`
- **Role:** `:generated`
- **Definition:** `code.translate.rule/compile-rules`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Clojure to HAL rules are not priority ordered"
```

### Legacy form

```clojure
(ex-info "Clojure to HAL rules are not priority ordered"
                          {:previous previous-priority
                           :rule rule})
```

### Enclosing definition

```clojure
(defn compile-rules
  "Validates and indexes deterministic, evidence-backed translation rules."
  [rules]
  (loop [index 0
         previous-priority -1
         identifiers {}
         automatic-matchers {}
         output []]
    (if (= index (count rules))
      output
      (let [rule (nth rules index)
            identifier (:id rule)
            priority (:priority rule)
            match-key (matcher-key rule)]
        (if (not (rule-valid? rule))
          (throw (ex-info "Invalid Clojure to HAL rule"
                          {:rule rule
                           :index index})))
        (if (< priority previous-priority)
          (throw (ex-info "Clojure to HAL rules are not priority ordered"
                          {:previous previous-priority
                           :rule rule})))
        (if (has? identifiers identifier)
          (throw (ex-info "Duplicate Clojure to HAL rule identifier"
                          {:id identifier})))
        (if (and (automatic? rule)
                 (has? automatic-matchers match-key))
          (throw (ex-info "Conflicting automatic Clojure to HAL rules"
                          {:matcher match-key
                           :left (get automatic-matchers match-key)
                           :right identifier})))
        (recur
         (inc index)
         priority
         (assoc identifiers identifier true)
         (if (automatic? rule)
           (assoc automatic-matchers match-key identifier)
           automatic-matchers)
         (conj output (assoc rule :compiled/index index)))))))
```

---

## 167. hara-lang/hara — `core/rust/hal-src/code/translate/rule.hal:110`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/rust/hal-src/code/translate/rule.hal" "code.translate.rule/selected-mode" 0]`
- **Role:** `:generated`
- **Definition:** `code.translate.rule/selected-mode`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported Clojure to HAL translation mode"
```

### Legacy form

```clojure
(ex-info "Unsupported Clojure to HAL translation mode"
                      {:mode mode
                       :supported +modes+})
```

### Enclosing definition

```clojure
(defn selected-mode
  [options]
  (let [mode (or (:mode options) :review)]
    (if (not (has? +modes+ mode))
      (throw (ex-info "Unsupported Clojure to HAL translation mode"
                      {:mode mode
                       :supported +modes+})))
    mode))
```

---

## 168. hara-lang/hara — `core/rust/hal-src/std/dom/common.hal:23`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/rust/hal-src/std/dom/common.hal" "std.dom.common/dom-field-set" 0]`
- **Role:** `:generated`
- **Definition:** `std.dom.common/dom-field-set`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unknown DOM field"
```

### Legacy form

```clojure
(ex-info "Unknown DOM field" {:field key})
```

### Enclosing definition

```clojure
(defn dom-field-set
  [dom key value]
  (case key
    :tag     (set! (field dom :tag)     value)
    :props   (set! (field dom :props)   value)
    :item    (set! (field dom :item)    value)
    :parent  (set! (field dom :parent)  value)
    :handler (set! (field dom :handler) value)
    :shadow  (set! (field dom :shadow)  value)
    :cache   (set! (field dom :cache)   value)
    :extra   (set! (field dom :extra)   value)
    (throw (ex-info "Unknown DOM field" {:field key})))
  dom)
```

---

## 169. hara-lang/hara — `core/rust/hal-src/std/dom/common.hal:92`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/rust/hal-src/std/dom/common.hal" "std.dom.common/dom-new" 0]`
- **Role:** `:generated`
- **Definition:** `std.dom.common/dom-new`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No tag available"
```

### Legacy form

```clojure
(ex-info "No tag available" {:tag tag})
```

### Enclosing definition

```clojure
(defn dom-new
  ([] (dom-new nil))
  ([value]
   (cond (keyword? value) (dom-new value nil)
         (map? value) (let [{:keys [tag props item parent handler shadow cache extra]} value]
                        (dom-new tag props item parent handler shadow cache extra))))
  ([tag props] (dom-new tag props nil nil nil nil nil nil))
  ([tag props item parent handler shadow cache extra]
   (if-not (type/metaprops tag)
     (throw (ex-info "No tag available" {:tag tag})))
   (Dom tag props item parent handler shadow cache extra)))
```

---

## 170. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/registry.hal:73`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/registry.hal" "std.context.registry/registry-get" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.registry/registry-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No context available"
```

### Legacy form

```clojure
(ex-info "No context available"
                      {:context context :options (registry-list)})
```

### Enclosing definition

```clojure
(defn registry-get [context]
  (or (get (deref *registry*) context)
      (throw (ex-info "No context available"
                      {:context context :options (registry-list)}))))
```

---

## 171. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/resource.hal:59`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/resource.hal" "std.context.resource/spec-get" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.resource/spec-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No resource spec available"
```

### Legacy form

```clojure
(ex-info "No resource spec available"
                      {:type type :options (spec-list)})
```

### Enclosing definition

```clojure
(defn spec-get [type]
  (or (get (deref *resource-registry*) type)
      (throw (ex-info "No resource spec available"
                      {:type type :options (spec-list)}))))
```

---

## 172. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/resource.hal:88`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/resource.hal" "std.context.resource/variant-get" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.resource/variant-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No resource variant available"
```

### Legacy form

```clojure
(ex-info "No resource variant available"
                       {:type type :variant id
                        :options (keys (:variant spec))})
```

### Enclosing definition

```clojure
(defn variant-get
  ([type] (variant-get type :default))
  ([type id]
   (let [spec (spec-get type)
         variant (get-in spec [:variant id])]
     (if variant
       (resource-merge-config (dissoc spec :variant) variant)
       (throw (ex-info "No resource variant available"
                       {:type type :variant id
                        :options (keys (:variant spec))}))))))
```

---

## 173. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/resource.hal:161`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/resource.hal" "std.context.resource/resource-key" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.resource/resource-key`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Unsupported resource mode"
```

### Legacy form

```clojure
(ex-info "Unsupported resource mode" {:mode mode})
```

### Enclosing definition

```clojure
(defn resource-key [mode type variant input & arguments]
  (let [input (or (last arguments) input)]
    (case mode
      :global nil
      :namespace (or (if (map? input) (:namespace input) input)
                     *resource-namespace*
                     :default)
      :shared (if (map? input)
                (let [key-function (get-in (variant-get type variant)
                                           [:mode :key])]
                  (key-function input))
                input)
      (throw (ex-info "Unsupported resource mode" {:mode mode})))))
```

---

## 174. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/resource.hal:182`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/resource.hal" "std.context.resource/resource-active-start" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.resource/resource-active-start`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Resource already started"
```

### Legacy form

```clojure
(ex-info "Resource already started"
                    {:type type :variant variant :key key})
```

### Enclosing definition

```clojure
(defn resource-active-start [mode type variant key config]
  (if (resource-active-get mode type variant key)
    (throw (ex-info "Resource already started"
                    {:type type :variant variant :key key}))
    (let [instance (resource-setup type variant config)]
      (resource-active-set mode type variant key
                           {:key key :config config :instance instance})
      instance)))
```

---

## 175. hara-lang/hara — `core/spec/code-migrate/recipes/std/context/resource.hal:211`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-migrate/recipes/std/context/resource.hal" "std.context.resource/resource-active-get-or-start" 0]`
- **Role:** `:fixture`
- **Definition:** `std.context.resource/resource-active-get-or-start`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Resource mode not allowed"
```

### Legacy form

```clojure
(ex-info "Resource mode not allowed"
                      {:mode mode :options allowed})
```

### Enclosing definition

```clojure
(defn resource-active-get-or-start [mode type variant key config]
  (let [spec (variant-get type variant)
        allowed (get-in spec [:mode :allow])]
    (if (not (has? allowed mode))
      (throw (ex-info "Resource mode not allowed"
                      {:mode mode :options allowed})))
    (or (:instance (resource-active-get mode type variant key))
        (resource-active-start mode type variant key config))))
```

---

## 176. hara-lang/hara — `core/spec/code-translate/recipes/std/context/registry.hal:56`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara" "core/spec/code-translate/recipes/std/context/registry.hal" "std.context.registry/registry-get" 0]`
- **Role:** `:production`
- **Definition:** `std.context.registry/registry-get`
- **Legacy code:** `—`
- **Proposed code:** `:hara/generic`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"No context available"
```

### Legacy form

```clojure
(ex-info "No context available"
                      {:context context :options (registry-list)})
```

### Enclosing definition

```clojure
(defn registry-get [context]
  (or (get (deref *registry*) context)
      (throw (ex-info "No context available"
                      {:context context :options (registry-list)}))))
```

---

## 177. hara-lang/hara-docs — `docs/assets/tictactoe/tictactoe.hal:80`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/assets/tictactoe/tictactoe.hal" "next-move" 0]`
- **Role:** `:production`
- **Definition:** `next-move`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Game has finished."
```

### Legacy form

```clojure
(ex-info "Game has finished." {:game game :move move})
```

### Enclosing definition

```clojure
(defn next-move
  "Transitions from one game state to the next."
  [game move]
  (let [[side pos] move
        board (get game :board)
        turn (get game :turn)
        status (get game :status)]
    (do
      (when (not= status :active)
        (throw (ex-info "Game has finished." {:game game :move move})))
      (when (not= turn side)
        (throw (ex-info (str "Not " side "'s turn.") {:game game :move move})))
      (when (not (contains? (get board :bg) pos))
        (throw (ex-info "Position already taken." {:game game :move move})))
      (let [new-board
            (assoc
              (assoc board :bg (disj (get board :bg) pos))
              side
              (conj (get board side) pos))
            line (winning-condition (get new-board side))
            is-winner (not (nil? line))
            is-full (= 0 (count (get new-board :bg)))]
        {:board new-board
         :turn (if (= side :p1) :p2 :p1)
         :status (if is-winner :done (if is-full :done :active))
         :winner (if is-winner side (if is-full :draw nil))
         :winning-line line}))))
```

---

## 178. hara-lang/hara-docs — `docs/assets/tictactoe/tictactoe.hal:82`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/assets/tictactoe/tictactoe.hal" "next-move" 1]`
- **Role:** `:production`
- **Definition:** `next-move`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "Not " side "'s turn.")
```

### Legacy form

```clojure
(ex-info (str "Not " side "'s turn.") {:game game :move move})
```

### Enclosing definition

```clojure
(defn next-move
  "Transitions from one game state to the next."
  [game move]
  (let [[side pos] move
        board (get game :board)
        turn (get game :turn)
        status (get game :status)]
    (do
      (when (not= status :active)
        (throw (ex-info "Game has finished." {:game game :move move})))
      (when (not= turn side)
        (throw (ex-info (str "Not " side "'s turn.") {:game game :move move})))
      (when (not (contains? (get board :bg) pos))
        (throw (ex-info "Position already taken." {:game game :move move})))
      (let [new-board
            (assoc
              (assoc board :bg (disj (get board :bg) pos))
              side
              (conj (get board side) pos))
            line (winning-condition (get new-board side))
            is-winner (not (nil? line))
            is-full (= 0 (count (get new-board :bg)))]
        {:board new-board
         :turn (if (= side :p1) :p2 :p1)
         :status (if is-winner :done (if is-full :done :active))
         :winner (if is-winner side (if is-full :draw nil))
         :winning-line line}))))
```

---

## 179. hara-lang/hara-docs — `docs/assets/tictactoe/tictactoe.hal:84`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/assets/tictactoe/tictactoe.hal" "next-move" 2]`
- **Role:** `:production`
- **Definition:** `next-move`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
"Position already taken."
```

### Legacy form

```clojure
(ex-info "Position already taken." {:game game :move move})
```

### Enclosing definition

```clojure
(defn next-move
  "Transitions from one game state to the next."
  [game move]
  (let [[side pos] move
        board (get game :board)
        turn (get game :turn)
        status (get game :status)]
    (do
      (when (not= status :active)
        (throw (ex-info "Game has finished." {:game game :move move})))
      (when (not= turn side)
        (throw (ex-info (str "Not " side "'s turn.") {:game game :move move})))
      (when (not (contains? (get board :bg) pos))
        (throw (ex-info "Position already taken." {:game game :move move})))
      (let [new-board
            (assoc
              (assoc board :bg (disj (get board :bg) pos))
              side
              (conj (get board side) pos))
            line (winning-condition (get new-board side))
            is-winner (not (nil? line))
            is-full (= 0 (count (get new-board :bg)))]
        {:board new-board
         :turn (if (= side :p1) :p2 :p1)
         :status (if is-winner :done (if is-full :done :active))
         :winner (if is-winner side (if is-full :draw nil))
         :winning-line line}))))
```

---

## 180. hara-lang/hara-docs — `docs/rust/std/substrate/util.hal:160`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/rust/std/substrate/util.hal" "std.substrate.util/config-normalize-space" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-space`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "space id mismatch - " space-id)
```

### Legacy form

```clojure
(ex-info (str "space id mismatch - " space-id)
                        {:space-id space-id :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-space
  "Normalises declarative space config."
  [space-id config]
  (cond
    (nil? config) nil

    (map? config)
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id space-id))
        (throw (ex-info (str "space id mismatch - " space-id)
                        {:space-id space-id :config config}))
        {"state" (or (get config "state") (get config :state))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid space config - " space-id)
                    {:space-id space-id :config config}))))
```

---

## 181. hara-lang/hara-docs — `docs/rust/std/substrate/util.hal:180`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/rust/std/substrate/util.hal" "std.substrate.util/config-normalize-handler" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-handler`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "handler id mismatch - " action)
```

### Legacy form

```clojure
(ex-info (str "handler id mismatch - " action)
                        {:action action :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-handler
  "Normalises handler config from a function or declarative entry."
  [action config]
  (cond
    (fn? config)
    {"fn" config "meta" {}}

    (and (map? config)
         (fn? (or (get config "fn") (get config :fn))))
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id action))
        (throw (ex-info (str "handler id mismatch - " action)
                        {:action action :config config}))
        {"fn" (or (get config "fn") (get config :fn))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid handler config - " action)
                    {:action action :config config}))))
```

---

## 182. hara-lang/hara-docs — `docs/rust/std/substrate/util.hal:200`

- [ ] Reviewed
- **Site ID:** `["hara-lang/hara-docs" "docs/rust/std/substrate/util.hal" "std.substrate.util/config-normalize-trigger" 0]`
- **Role:** `:production`
- **Definition:** `std.substrate.util/config-normalize-trigger`
- **Legacy code:** `—`
- **Proposed code:** `—`
- **Proposed class:** `:ex.class/internal`
- **Shared base class:** `:ex.class/internal`
- **Application:** `—`
- **Selected code:** `________________`
- **Selected class:** `________________`
- **Reviewer notes:**

### Message expression

```clojure
(str "trigger id mismatch - " signal)
```

### Legacy form

```clojure
(ex-info (str "trigger id mismatch - " signal)
                        {:signal signal :config config})
```

### Enclosing definition

```clojure
(defn config-normalize-trigger
  "Normalises trigger config from a function or declarative entry."
  [signal config]
  (cond
    (fn? config)
    {"fn" config "meta" {}}

    (and (map? config)
         (fn? (or (get config "fn") (get config :fn))))
    (let [configured-id (or (get config "id") (get config :id))]
      (if (and configured-id (not= configured-id signal))
        (throw (ex-info (str "trigger id mismatch - " signal)
                        {:signal signal :config config}))
        {"fn" (or (get config "fn") (get config :fn))
         "meta" (or (get config "meta") (get config :meta) {})}))

    :else
    (throw (ex-info (str "invalid trigger config - " signal)
                    {:signal signal :config config}))))
```

---
